<template>
  <div class="app-container">
    <!-- @click="handleAddRole" -->
    <el-button type="primary" >新增角色</el-button>
    
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
              @click="showEditDialog(scope.row.id)"
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
    </el-card>
  </div>
</template>

<script>
import { getRoles, deleteRole } from "@/api/role";

export default {
  data() {
    return {
      rolesList:[],
      //获取用户列表的参数对象
    }
  },
  mounted() {
    this.getRolesList();
  },
  methods: {
    getRolesList(){
      getRoles()
        // 请求成功
        .then((res) => {
          this.rolesList = res.data.dataList
          this.total = res.data.dataList.length
          console.log(res.data.dataList,res.data.dataList.length);
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

