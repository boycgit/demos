import { createModel } from '../../src/';
describe('createModel - 根据 json 创建 schema ', () => {
  test('单层级创建，自动创建 id', () => {
    const schema = createModel({
      visible: true,
      text: 'hello'
    });
    expect(schema.visible).toBeTruthy();
    expect(schema.text).toBe('hello');
  });
});
