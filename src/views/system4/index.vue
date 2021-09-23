<template>
  <div class="app-container">
    <h1>用户列表</h1>
    {{ msg }}  
  </div>
</template>

<script>
import { Uerlist } from "@/api/user";

export default {
  data() {
    return {
      msg: ""
    }
  },
  mounted() {
    this.test();
  },
  methods: {
      test(){
        Uerlist()
          // 请求成功
          .then((res) => {
            console.log(res.data.dataList);
            console.log(res.data.dataList[0]);
            this.msg = res
          })
          // 请求失败
          .catch((err) => {
            console.log(err)
          });
    }
  }
}
</script>

<style scoped>
</style>

