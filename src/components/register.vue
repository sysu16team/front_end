<template>
  <div class="layout">
    <Layout>

      <Header class="layout-header">
      </Header>

      <Content class="colLayout">
        <Row  class="rowLayout">
          <Col span="5" offset="2" >
            <div class="avatar-box">
              <img :src="avatarImg" />
              <label class="img-upload-box " for="fileInput">
                <Icon type="ios-camera" size="30"></Icon>
              </label>
              <input id="fileInput" type="file">
            </div>
          </Col>
          <Col span="10">
            <template v-if="userType=='0'">
              <Form ref="infoForm" :model="userInfo" :rules="userRuleConfirm"
                    label-position="right" :label-width="90" key="user-form">
                <FormItem label="用户名" prop="username">
                  <Input v-model="userInfo.username" placeholder="请输入用户名"></Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                  <Input v-model="userInfo.password" placeholder="请输入密码" type="password"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="confirmPassword">
                  <Input v-model="userInfo.confirmPassword" placeholder="请再次输入您的密码" type="password"></Input>
                </FormItem>
                <FormItem label="姓名" prop="name">
                  <Input v-model="userInfo.name" placeholder="请输入真实姓名"></Input>
                </FormItem>
                <FormItem label="学校" prop="school">
                  <Input v-model="userInfo.school" placeholder="请输入学校"></Input>
                </FormItem>
                <FormItem label="年级" prop="grade">
                  <Select v-model="userInfo.grade">
                    <Option value="1">大一</Option>
                    <Option value="2">大二</Option>
                    <Option value="3">大三</Option>
                    <Option value="4">大四</Option>
                    <Option value="5">研究生</Option>
                  </Select>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                  <Input v-model="userInfo.email" placeholder="请输入联系邮箱"></Input>
                </FormItem>
                <FormItem>
                  <span style="float: left;">
                    <router-link to="/login">已有账号，点击此处登录></router-link>
                  </span>
                  <Button @click="handleReset('infoForm')" style="float: right">重置</Button>
                  <Button @click="userRegisterSubmit('infoForm')" type="primary" style="float:right; margin-right: 10px">注册</Button>
                </FormItem>
              </Form>
            </template>


          </Col>
        </Row>
      </Content>
    </Layout>
  </div>

</template>
<script>
  var SHA256 = require("crypto-js/sha256");
  export default {
    data() {
      const confirmUserPassConf = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入您的密码'));
        } else if (this.userType == 0 && value !== this.userInfo.password) {
          callback(new Error('两次密码不一致'));
        }else if (this.userType == 1 && value !== this.orgInfo.password) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      };

      return {
        userRuleConfirm: {
          username: [
            {required: true, message: '用户名不能为空'}
          ],
          password: [
            {required: true, message: '密码不能为空'}
          ],
          confirmPassword: [
            {required: true, validator: confirmUserPassConf}
          ],
          name: [
            {required: true, message: '姓名不能为空'}
          ],
          school: [
            {required: true, message: '学校不能为空'}
          ],
        },

        orgRuleConfirm: {
          username: [
            {required: true, message: '机构名不能为空'}
          ],
          password: [
            {required: true, message: '密码不能为空'}
          ],
          confirmPassword: [
            {required: true, validator: confirmUserPassConf}
          ],
          name: [
            {required: true, message: '负责人姓名不能为空'}
          ],
          address: [
            {required: true, message: '地址不能为空'}
          ]
        },

        userType: '0',

        defaultAvatarImg: '',
        avatarImg: '',

        userInfo: {
          username: '',
          password: '',
          confirmPassword: '',
          name: '',
          school: '',
          grade: '1',
          email: '',
          signature: '',
        },

        orgInfo: {
          username: '',
          password: '',
          confirmPassword: '',
          name: '',
          address: '',
          phone: '',
          weChat: '',
          email: '',
          signature: '',
        }


      };
    },

    methods: {
      dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
      },

      userRegisterSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let formData = new FormData();
            formData.append("type", this.userType);

            let info = this.userType == '0' ? this.userInfo : this.orgInfo;
            for(var key in info) {
              if (key == 'confirmPassword') continue;
              else if (key == 'password') {
                formData.append("password", SHA256(info.password).toString());
              }
              else {
                formData.append(key, info[key]);
              }
            }

            if (this.avatarImg != this.defaultAvatarImg) {
              let blob = this.dataURLtoBlob(this.avatarImg);
              formData.append("avatar", blob);
            }

            this.$axios({
              method: 'post',
              url: '/api/v1/user/create',
              data: formData,
              config: {headers: {'Content-Type': 'multipart/form-data'}}
            })
              .then(msg => {
                  this.$Message.success('注册成功！');
                   this.$router.push({name: 'login'});
              })
              .catch(err => {
                this.$Message.error(err.response.statusText);
              });
          }
          else {
            this.$Message.error('Fail!');
          }
        })
      },

      handleReset (name) {
        this.$refs[name].resetFields();
      },
    }


  }
</script>


<style scoped>
  .layout {
    min-height: 100%;
    background: #fffff0;
    text-align: center;
  }

  .layout-header {
    background-color: #fff00;
  }

  .colLayout {
    background: #fffff0;
  }

  .rowLayout {
    margin-top: 40px;
  }

  .login-nav {
    float: left;
    margin-left: 10px;
  }

  .avatar-box {
    width: 100%;
    height: 100px;
    overflow: hidden;
    margin-top: 20 px;
    position: relative;
  }

  .avatar-box img {
    width: 100%;

    border-radius: 6px;
  }
  .img-upload-box {
    width: 80px;
    height: 80px;
    line-height: 80px;
    cursor: pointer;
    background: #ffffff;
    border: 1px dashed #dcdee2;
    border-radius: 4px;
    display: inline-block;
    margin-top: 10px;
  }

  .img-upload-box:hover {
    border-color: #2d8cf0;
  }

  #fileInput {
    display: none;
  }

</style>
