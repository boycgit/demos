var crypto = require('crypto');
var { EventEmitter } = require('events');
var MAX_FRAME_SIZE = 1024; // 最长长度限制
var MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

/**
 *  数据类型操作码 TEXT 字符串
 *  BINARY 二进制数据 常用来保存照片
 *  PING,PONG 用作心跳检测
 *  CLOSE 关闭连接的数据帧 (有很多关闭连接的代码 1001，1009,1007,1002)
 */
var OPCODES = {
  CONTINUE: 0,
  TEXT: 1,
  BINARY: 2,
  CLOSE: 8,
  PING: 9,
  PONG: 10
};

var hashWebSocketKey = function(key) {
  var sha1 = crypto.createHash('sha1');
  sha1.update(key + MAGIC_STRING, 'ascii');
  return sha1.digest('base64');
};
/**
 * 解掩码
 * @param maskBytes 掩码数据
 * @param data payload
 * @returns {Buffer}
 */
var unmask = function(maskBytes, data) {
  var payload = Buffer.alloc(data.length);
  for (var i = 0; i < data.length; i++) {
    payload[i] = maskBytes[i % 4] ^ data[i];
  }
  return payload;
};

/**
 * 编码数据
 * @param opcode 操作码
 * @param payload   数据
 * @returns {*}
 */
var encodeMessage = function(opcode, payload, isFinal = true) {
  var buf;
  var b1 = (isFinal ? 0x80 : 0x00) | opcode;
  var b2;
  var length = payload.length;
  if (length < 126) {
    buf = Buffer.alloc(payload.length + 2 + 0);
    b2 |= length;
    //buffer ,offset
    buf.writeUInt8(b1, 0); //读前8bit
    buf.writeUInt8(b2, 1); //读8―15bit
    payload.copy(buf, 2); //复制数据,从2(第三)字节开始
  } else if (length < 1 << 16) {
    buf = Buffer.alloc(payload.length + 2 + 2);
    b2 |= 126;
    buf.writeUInt8(b1, 0);
    buf.writeUInt8(b2, 1);
    buf.writeUInt16BE(length, 2);
    payload.copy(buf, 4);
  } else {
    buf = Buffer.alloc(payload.length + 2 + 8);
    b2 |= 127;
    buf.writeUInt8(b1, 0);
    buf.writeUInt8(b2, 1);
    buf.writeUInt32BE(0, 2);
    buf.writeUInt32BE(length, 6);
    payload.copy(buf, 10);
  }

  return buf;
};

class WebSocket extends EventEmitter {
  constructor(req, socket, upgradeHead) {
    super();
    var resKey = hashWebSocketKey(req.headers['sec-websocket-key']);

    // 构造响应头
    var resHeaders = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      'Sec-WebSocket-Accept: ' + resKey
    ]
      .concat('', '')
      .join('\r\n');

    socket.on('data', data => {
      this.buffer = Buffer.concat([this.buffer, data]);
      while (this._processBuffer()) {}
    });

    socket.on('close', had_error => {
      if (!this.closed) {
        this.emit('close', 1006);
        this.closed = true;
      }
    });

    socket.write(resHeaders);

    this.socket = socket;
    this.buffer = Buffer.alloc(0);
    this.closed = false;
    this.frames = Buffer.alloc(0);
    this.frameOpcode = 0;
    this.keepLiveTimer = null;
  }
  /*
 发送数据函数
 * */
  send(obj) {
    var opcode;
    var payload;
    // 如果是二进制
    if (Buffer.isBuffer(obj)) {
      opcode = OPCODES.BINARY;
      payload = obj;
    } else if (typeof obj) {
      // 承载的文本内容
      opcode = OPCODES.TEXT;
      //创造一个utf8的编码，可以被编码为字符串
      payload = Buffer.from(obj, 'utf8');
    } else {
      throw new Error('cannot send object.Must be string of Buffer');
    }

    this._doSend(opcode, payload);
  }

  // 默认 45 秒 保持发送心跳
  keepLive(timeout = 45000) {
    var self = this;
    function keepit() {
      self._doSend(OPCODES.PING, Buffer.from('ping'));
      console.log('server send ping...');
      // 在关闭连接的情况下就不再需要发送 ping 请求了
      if (!self.closed){
        self.keepLiveTimer = setTimeout(keepit, timeout);
      }
    }
    keepit();
  }

  /*
 关闭连接函数
 * */
  close(code, reason) {
    var opcode = OPCODES.CLOSE;
    var buffer;
    if (code) {
      buffer = Buffer.alloc(Buffer.byteLength(reason) + 2);
      buffer.writeUInt16BE(code, 0);
      buffer.write(reason, 2);
    } else {
      buffer = Buffer.alloc(0);
    }
    this._doSend(opcode, buffer);
    this.closed = true;
  }

  _processBuffer() {
    var buf = this.buffer;
    if (buf.length < 2) {
      return;
    }
    var idx = 2;
    var byte1 = buf.readUInt8(0); // 读取数据帧的前 8 bit
    var FIN = byte1 & 0x80; // 如果为0x80，则标志传输结束，获取高位 bit
    var opcode = byte1 & 0x0f; //截取第一个字节的后 4 位，即 opcode 码

    // 如果是 0 的话，说明是延续帧，需要保存好 opCode
    if (!FIN) {
      this.frameOpcode = opcode || this.frameOpcode; // 确保不为 0;
    }

    var byte2 = buf.readUInt8(1); // 读取数据帧第二个字节
    var MASK = byte2 & 0x80; // 判断是否有掩码，客户端必须要有，获取高位 bit
    var length = byte2 & 0x7f; //获取length属性，也是小于126数据长度的数据真实值
    if (length > 125) {
      if (buf.length < 8) {
        return; // 如果大于125，而字节数小于 8，则显然不合规范要求
      }
    }
    if (length === 126) {
      //获取的值为126 ，表示后两个字节（16位）用于表示数据长度
      length = buf.readUInt16BE(2); // 读取 16bit 的值
      idx += 2; // +2
    } else if (length === 127) {
      //获取的值为 127 ，表示后 8 个字节（64位）用于表示数据长度，其中高 4 字节是 0
      var highBits = buf.readUInt32BE(2); //(1/0)1111111，切记 MSB 最高位是 0
      if (highBits != 0) {
        this.close(1009, ''); //1009 关闭代码，说明数据太大； 协议里是支持 63 位长度，不过这里我们自己实现的话，只支持 32 位长度，防止数据过大；
      }
      length = buf.readUInt32BE(6); // 从第 6 到第 10 个字节（32位）为真实存放的数据长度
      idx += 8;
    }
    if (buf.length < idx + 4 + length) {
      //不够长 4为掩码字节数
      return;
    }
    // 如果有 mask 标志位，默认都是有的
    if (MASK) {
      var maskBytes = buf.slice(idx, idx + 4); //获取掩码数据
      idx += 4; //指针前移到真实数据段
      var payload = buf.slice(idx, idx + length); // 数据长度的单位是字节
      payload = unmask(maskBytes, payload); //解码真实数据
    } else {
      payload = buf.slice(idx, idx + length);
    }

    this.buffer = buf.slice(idx + length); // 缓存 buffer
    // 有可能是分帧，需要拼接数据
    this.frames = Buffer.concat([this.frames, payload]); // 保存到 frames 中

    if (!FIN) {
      console.log(
        'server detect fragment, sizeof payload:',
        Buffer.byteLength(payload)
      );
    }

    if (FIN) {
      payload = this.frames.slice(0); // 获取所有拼接完整的数据
      opcode = opcode || this.frameOpcode; // 如果是 0 ，则保持获取之前保存的 code
      this.frames = Buffer.alloc(0); // 清空 frames
      this.frameOpcode = 0; // 清空 opcode
      this._handleFrame(opcode, payload); // 处理操作码
    }

    return true; // 继续处理
  }
  /**
   * 针对不同操作码进行不同处理
   * @param 操作码
   * @param 数据
   */
  _handleFrame(opcode, buffer) {
    var payload;
    switch (opcode) {
      case OPCODES.TEXT:
        payload = buffer.toString('utf8'); //如果是文本需要转化为utf8的编码
        this.emit('data', opcode, payload); //Buffer.toString()默认utf8 这里是故意指示的
        break;
      case OPCODES.BINARY: //二进制文件直接交付
        payload = buffer;
        this.emit('data', opcode, payload);
        break;
      case OPCODES.PING: // 发送 pong 做响应
        this._doSend(OPCODES.PONG, buffer);
        break;
      case OPCODES.PONG: //不做处理
        console.log('server receive pong');
        break;
      case OPCODES.CLOSE: // close有很多关闭码
        let code, reason; // 用于获取关闭码和关闭原因
        if (buffer.length >= 2) {
          code = buffer.readUInt16BE(0);
          reason = buffer.toString('utf8', 2);
        }
        this.close(code, reason);
        this.emit('close', code, reason);
        break;
      default:
        this.close(1002, 'unhandle opcode:' + opcode);
    }
  }
  // 这里可以针对 payload 的长度做分片
  _doSend(opcode, payload) {
    var len = Buffer.byteLength(payload);

    // 分片的距离逻辑
    var count = 0;
    while (len > MAX_FRAME_SIZE) {
      var framePayload = payload.slice(0, MAX_FRAME_SIZE);
      payload = payload.slice(MAX_FRAME_SIZE);
      this.socket.write(
        encodeMessage(
          count > 0 ? OPCODES.CONTINUE : opcode,
          framePayload,
          false
        )
      ); //编码后直接通过socket发送
      count++;
      len = Buffer.byteLength(payload);
    }

    this.socket.write(
      encodeMessage(count > 0 ? OPCODES.CONTINUE : opcode, payload)
    ); //编码后直接通过socket发送
  }
}

module.exports = WebSocket;
