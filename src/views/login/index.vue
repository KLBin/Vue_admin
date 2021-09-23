<template>
  <div id="main">
    <p-articles></p-articles>
    <div class="login">
      <p>系统登录</p>
      <div class="input">
        <span v-text="tips"></span>
        <!-- draggable="false" 图片不能被拖动 -->
        <img src="~@/assets/user.png" alt="" draggable="false" /><input
          v-model="username"
          type="text"
          placeholder="请输入用户名"
        />
        <img src="~@/assets/pwd.png" alt="" draggable="false" /><input
          v-model="password"
          type="password"
          placeholder="请输入密码"
        />
        <img src="~@/assets/yzm.png" alt="" draggable="false" /><input
          type="text"
          id="yzm"
          v-model="yanzhenma"
          placeholder="请输入验证码"
          autocomplete="off"
        />
        <div id="yzm2">
          {{ msg }}
          <img :src="imgSrc" alt="" draggable="false" @click="code" />
        </div>
        <div class="check">
          <a @click="check"
            ><input type="checkbox" v-model="isCheck" />&nbsp;记住密码</a
          >
          <a href="#">忘记密码？</a>
        </div>
        <button @click="login">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import PArticles from "@/components/Particles/particles.vue";
import { GetYzm } from "@/api/user";

export default {
  name: "Login",
  components: {
    PArticles,
  },
  data() {
    return {
      msg: "加载中",
      tips: "",
      username: "201801069",
      password: "pengyibin",
      yanzhenma: "",
      imgSrc: "",
      isCheck: false,
      isClick: true,
      btnClick: true,
      timer: "",
    };
  },
  mounted() {
    this.code();
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    // 复选框
    check() {
      if (this.isCheck == false) {
        this.isCheck = true;
      } else if (this.isCheck == true) {
        this.isCheck = false;
      }
    },
    // 登录
    login() {
      if (this.btnClick == true) {
        clearTimeout(this.timer);
        // 用户名密码验证码存入JSON
        var JSONdata = {
          username: this.username,
          password: this.password,
          code: this.yanzhenma,
        };
        if (this.username == "") {
          this.tips = "请输入用户名";
        } else if (this.password == "") {
          this.tips = "请输入密码";
        } else if (this.yanzhenma == "") {
          this.tips = "请输入验证码";
        } else {
          this.$store
            .dispatch("user/login", JSONdata)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.code()
            });
        }
        this.timer = setTimeout(() => (this.tips = ""), 2000);
        this.btnClick = false;
        setTimeout(() => {
          this.btnClick = true;
        }, 1000);
      }
    },
    // 验证码
    code() {
      if (this.isClick == true) {
        GetYzm()
          // 请求成功
          .then((res) => {
            this.msg = "";
            // 创建blob对象,把图片流赋给blob
            let blob = new Blob([res.data], { type: "image/png" });
            // 将blob对象转为src
            let src = window.URL.createObjectURL(blob);
            this.imgSrc = src;
          })
          // 请求失败
          .catch((err) => {
            console.log(err);
            this.msg = "加载失败";
          });
        this.isClick = false;
        setTimeout(() => {
          this.isClick = true;
        }, 500);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
img,
input {
  vertical-align: middle;
}
.login {
  position: relative;
  margin: 0 auto;
  width: 400px;
  height: 350px;
  background-color: rgb(255 255 255 / 50%);
  margin-top: 17%;
  border-radius: 20px;
  box-shadow: 0 3px 3px -2px #000;
}
.login > p {
  margin: 0 auto;
  color: #000;
  font-size: 25px;
  text-align: center;
  padding: 16px 0 0 0;
  user-select: none;
}
.login > .input {
  margin: 0 auto;
  width: 330px;
}
span {
  padding: 0px 50px;
  font-size: 12px;
  color: #f00;
}
.login > .input > input {
  width: 235px;
  height: 40px;
  margin-bottom: 20px;
  padding: 0 20px 0 68px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 7px;
}
#yzm {
  width: 120px;
}
#yzm2 {
  float: right;
  margin: 0 12px 0 0;
  width: 100px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  // background-color: #fff;
}
#yzm2 > img {
  width: 100px;
  // height: 40px;
  user-select: none;
}
.login > .input > input:focus {
  outline: none;
}
.login > .input > input::placeholder {
  color: #aaa;
}
.login > .input > img {
  width: 24px;
  display: block;
  position: absolute;
  margin-top: 7px;
  margin-left: 11px;
  border-right: #9a9a9a 1px solid;
  padding-right: 11px;
  user-select: none;
}
input[type="checkbox"] {
  cursor: pointer;
}
.login > .input > .check {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.login > .input > .check > a {
  font-size: 13px;
  font-weight: bold;
  user-select: none;
}
.login > .input > .check > a:hover {
  color: #ff3334;
}
.login > .input > button {
  width: 330px;
  height: 40px;
  margin-top: 10px;
  border-width: 0;
  border-radius: 7px;
  background: #ff3334;
  text-align: center;
  color: white;
  font-size: 25px;
  letter-spacing: 10px;
  user-select: none;
  cursor: pointer;
}
.login > .input > button:hover {
  background: rgba(255, 46, 46, 0.3);
}
</style>
