

<template>
  <div class="layout">
    <Layout>
      <Content>


        <div class="login-contain">
                <Form ref="userLoginForm" :rules="ruleValidate" :model="userLoginInfo">
                  <FormItem label="username" prop="username" label-width="80">
                    <Input v-model="userLoginInfo.username" placeholder="请输入账号"/>
                  </FormItem>
                  <FormItem label="password" prop="password" label-width="80">
                    <Input v-model="userLoginInfo.password" type="password" placeholder="请输入密码"/>
                  </FormItem>
                  <FormItem class="form-footer">
                    <router-link class="register-link" to="/register">没有账号？立即注册</router-link>
                    <Button @click="login('userLoginForm', '0')" type="primary">Submit</Button>
                    <Button @click="reset('userLoginForm')"  style="margin-left: 8px">Reset</Button>
                  </FormItem>
                </Form>
        </div>
      </Content>
    </Layout>
  </div>


</template>
<script>
  var SHA256 = require("crypto-js/sha256");
  export default {
    data() {
      return {
        ruleValidate: {
          username: [
            {required: true, message: '请输入您的用户名',  trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入您的密码',  trigger: 'blur'}
          ],
        },

        userLoginInfo: {
          username: '',
          password: '',
        }

      };
    },
    methods: {
      login(name, type) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$axios({
              method: 'post',
              url: "/api/v1/user/login",
              data: {
                type: type,
                username: this.userLoginInfo.username,
                password: SHA256(this.userLoginInfo.password).toString()
              }
            })
            .then(msg => {
              if (msg.data.code == 200) {
                this.$Message.success(msg.data.msg);
                this.$router.push({name: 'MainPage'});
              }
              else {
                this.$Message.error(msg.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
              this.$Message.error(err.response.statusText);
            });
          }
          else {
            this.$Message.error('Fail!');
          }
        })

      },

      reset (name) {
        this.$refs[name].resetFields();
    }
    }
  }
</script>

<style>
.div-login .ivu-tabs-nav {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>

<style scoped>
.layout {
  min-height: 100%;
  background: #fffff0;
}
.title{
  top:40%;
}

.login-contain {
    position: fixed;
    left: 50%;
    margin-left: -200px;
    top: 50%;
    margin-top: -150px;
    width: 400px;
    height: 200px;
    border-radius: 10px;
    background-color: #ffffff;
    padding: 20px 30px;
    border:1px solid grey;
}

.login-head {
  text-align: center;
  margin-bottom: 20px;
}

.layout-header {
  background-color: #fffff0;
}

.login-nav {
  float: right;
}

.login-nav a {
  margin-left: 10px;
}

.register-link {
  float: left;
}

.form-footer {
    text-align: right;
}

</style>
