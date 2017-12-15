const { expect } = require('chai');

const DepartmentDao = require('../daos/department.dao');

describe('DepartmentDao的测试', () => {
  it('id=10000的部门', async () => {
    const [content] = await DepartmentDao.getDepartment({ id: 10000 });

    expect(content).to.be.an('object');
    expect(content.name).to.be.equal('技术部');
    expect(content.description).to.be.equal('这是一个技术部');
    expect(content.status).to.be.equal(0);
  });

  it('2 + 2 = 4', () => {
    expect(2 + 2).to.be.equal(4);
  });
});
