<template>
  <div class="app-container">
    <!-- 查询与新增 -->
    <el-form ref="selectForm" :model="selectForm" label-width="80px">
      <el-form-item>
        <el-button el-button type="primary" @click="addDialogVisible = true" >新增角色</el-button>
        <el-input v-model="selectForm.roleNum" style="width:40%;margin-left:15%;"></el-input>
        <el-button type="primary" @click="selectDialog(selectForm.roleNum)" style="margin-left:10px">查询</el-button>
      </el-form-item>
    </el-form>

    <el-card>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
        <el-table-column align="center" label="角色id">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色号">
          <template slot-scope="scope">
            {{ scope.row.roleNum }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="描述">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope)"
            ></el-button>
            <!-- 权限按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="dangere"
              icon="el-icon-delete"
              size="mini"
              :disabled="scope.row.id == '3b097f55e4a84d0bbeb114b69ff7c6e4'"
              @click="handleDelete(scope)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNo"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
    <!--添加角色对话框-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
        <el-form-item label="角色号" prop="roleNum">
          <el-input v-model="addForm.roleNum"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    
    <el-dialog 
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <!--编辑用户角色的对话框-->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="90px">
        <el-form-item label="角色id" prop="id" style="display: none;"> 
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="角色号" prop="roleNum">
          <el-input v-model="editForm.roleNum"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加权限对话框-->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="powerClosed">
      <!--内容主体区域-->
      <el-form ref="powerFormRef" label-width="90px">
        <!-- default-checked-keys 默认勾选的节点的 key 的数组 -->
        <el-tree
          :data="rightsList"
          :props="props"
          node-key="id"
          show-checkbox
          @check-change="handleCheckChange"
          :default-checked-keys="defKeys"
          default-expand-all
          ref="treeRef">
        </el-tree>
      </el-form>
      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRigths">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, deleteRole, addRole, selectRole, updateRole, getRolesMenu } from "@/api/role";

export default {
  data() {
    return {
      //获取用户列表的参数对象
      rolesList:[],
      queryInfo: {
        query: '',
        //当前的页数
        pageNo: 1,
        //当前每页显示多少条数据
        pageSize: 2,
      },
      total: 0,

      addDialogVisible: false, // 控制添加角色对话框是否显示
      editDialogVisible: false, // 控制修改角色信息对话框是否显示
      powerDialogVisible: false, // 控制权限对话框是否显示
      setRightDialogVisible: false, // 控制分配角色权限对话框是否显示
      rightsList: [], // 角色所有权限数据
      defKeys: [], // 默认选中的节点ID值数组
      
      // 添加角色的表单数据
      addForm: {
        roleNum: '',
        description: ''
      },
      // 修改角色信息的表单数据
      editForm: {
        id:'',
        roleNum: '',
        description: ''
      },
      // 权限树
      props: {
        id:'id',
        label: 'name',
        children: 'child',
        // isLeaf: 'leaf'
      },
      // 查找角色的表单数据
      selectForm: {
        roleNum: ''
      },
      // 添加用户表单的验证规则对象
      addFormRules: {
        roleNum: [
          { required: true, message: '请输入角色号', trigger: 'blur' },
          { min: 1, max: 10, pattern: /^[0-9]\d*$/, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    routesData () {
      return this.routes
    }
  },
  mounted() {
    this.getRolesList();
    // this.fetchData();
  },
  methods: {
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pageSize = newSize
      this.getRolesList()
    },
    //  监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pageNo = newPage
      this.getRolesList()
    },
    // 调接口展示角色信息
    getRolesList(){
      let params = {
        pageNo: this.queryInfo.pageNo,
        pageSize: this.queryInfo.pageSize,
      }
      getRoles(params)
        // 请求成功
        .then((res) => {
          this.rolesList = res.data.data.records
          this.total = res.data.data.total
          // console.log(res.data.data.records,res.data.data.total);
        })
        // 请求失败
        .catch((err) => {
          console.log(err)
        });
    },
    // 角色删除方法
    handleDelete({ $index, row }) {
      this.$confirm('是否确认删除此角色?', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.id)
          this.rolesList.splice($index, 1)
          this.getRolesList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    // 角色查询方法
     selectDialog(result){
      if (result == ""){
        this.handleCurrentChange(1)
        // this.getRolesList()
        return
      }
       selectRole(result)
        // 请求成功
        .then((res) => {
          if (res.data.ret == 404){
            this.$message.error("查询结果为空")
            return
          }
          this.rolesList = Object.values(res.data).splice(2)
          console.log(res.data) 
          this.$message.success('查询角色成功')
          this.total = 1
          // this.handleCurrentChange(1)
        })
        // 请求失败
        .catch((err) => {
          console.log(err)
        });
    },
    // 监听 添加用户对话框的关闭事件
    addDialogClosed() {
      // 表单内容重置为空
      this.$refs.addFormRef.resetFields() // 通过ref引用调用resetFields方法
    },
    // 添加角色方法
    confirm() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return  
        await addRole(this.addForm)
          // 请求成功
          .then((res) => {
            console.log(this.addForm)
            this.$message.success('添加角色成功')
          })
          // 请求失败
          .catch((err) => {
            console.log(err)
          });
        this.addDialogVisible = false
        // 重新发起请求角色列表
        this.getRolesList()
      })
    },
    // 监听 修改角色状态
    showEditDialog({ row }) {
      console.log(row.id)
      this.editDialogVisible = true
      selectRole(row.id)
        .then((res) => {
          this.editForm.id = res.data.data.id
          this.editForm.roleNum = res.data.data.roleNum
          this.editForm.description = res.data.data.description
        })
        .catch((err) => {
          this.$message.error('查询角色信息失败')
        })
    },
    // 监听 修改角色信息对话框的关闭事件
    editDialogClosed() {
      // 表单内容重置为空
      this.$refs.editFormRef.resetFields() // 通过ref引用调用resetFields方法
    },
    // 修改角色信息
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        await updateRole(this.editForm)
        .then((res) => {
          console.log(this.addForm)
          this.$message.success('修改角色信息成功！')
        })
          // 请求失败
        .catch((err) => {
          console.log(err)
        });
        // 关闭对话框
        this.editDialogVisible = false
        // 重新发起请求角色列表
        this.getRolesList()
      })
    },
    // 监听 修改角色信息对话框的关闭事件
    powerClosed() {
      // 表单内容重置为空
      this.$refs.powerFormRef.resetFields() // 通过ref引用调用resetFields方法
    },

     // 展示分配权限的对话框
    async showSetRightDialog(id) {
      this.setRightDialogVisible = true
      // 获取所有权限列表 树形
      await getRolesMenu()
        // 请求成功
        .then((res) => {
          
          this.rightsList = res.data.dataList
          console.log(res.data.dataList);
        })
        // 请求失败
        .catch((err) => {
          console.log(err)
        });
    },
    handleCheckChange(){
      // getCheckedNodes()
    },
    // 点击按钮 给角色分配权限
    async allotRigths(id) {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      // 关闭对话框
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style scoped>
.app-container{
  padding: 20px;
}
.el-card{
    box-shadow: 0 1px 1px rgba(0,0,0,0.15)  !important;
}
.el-pagination{
  margin-top: 20px;
  text-align:center
}
</style>

