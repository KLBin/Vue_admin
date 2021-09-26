<template>
  <div class="app-container">
    <!-- @click="handleAddRole" -->
    <el-button type="primary" @click="addDialogVisible = true" >新增角色</el-button>
    <el-card>
      <!-- 用户列表区域 -->
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
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="dangere"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页区域 -->
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

    <!--添加角色的对话框-->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!--内容主体区域-->
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
    <!--编辑用户角色的对话框-->
    <el-dialog title="修改角色信息"
    :visible.sync="editDialogVisible"
    width="50%"
    @close="editDialogClosed"
    >
    <!--内容主体区域-->
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
    <!--权限树-->
    <!-- <el-form-item label="权限">
      <el-tree
        ref="tree"
        :check-strictly="checkStrictly"
        :data="routesData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="roleOne"
        @check="getCheckedKeys"
        class="permission-tree"
      />
    </el-form-item> -->
  </div>
</template>

<script>
import { getRoles, deleteRole, addRole, selectRole, updateRole} from "@/api/role";

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
      // 权限树的数据
      form: {},
      permissionIds: [],
      routes: [],
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'name'
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
      console.log(newSize)
      this.queryInfo.pageSize = newSize
      this.getRolesList()
    },
    //  监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pageNo = newPage
      this.getRolesList()
    },
    //调接口展示角色信息
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
          console.log(res.data.data.records,res.data.data.total);
        })
        // 请求失败
        .catch((err) => {
          console.log(err)
        });
    },
    handleDelete({ $index, row }) {
      this.$confirm('是否确认删除此角色?', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    // 监听 添加用户对话框的关闭事件
    addDialogClosed() {
    // 表单内容重置为空
      this.$refs.addFormRef.resetFields() // 通过ref引用调用resetFields方法
    },
    // 点击按钮 添加新角色
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
    // 点击按钮 修改角色信息
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        let b = await updateRole(this.editForm)
        console.log(b)
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
    // fetchData () {
    //   this.listLoading = true
    //   menuRoleList().then(response => {
    //     this.listLoading = false
    //     // this.routes = response.data
    //     this.routes = this.buildMenus(response.data)
    //   })
    // },
  }
}
</script>

<style scoped>
.el-card{
    box-shadow: 0 1px 1px rgba(0,0,0,0.15)  !important;
}
.el-pagination{
  margin-top: 20px;
  text-align:center
}
</style>

