<template>
  <div class="contain">
    <h1 class="div-border-bottom">Profile</h1>
    <div class="div-userinfo">
      <h2>用户名</h2>
      <Input v-model="userInfo.username" disabled/>


      <div class="div-basicInf">
        <h1>基本信息</h1>
        <h2>姓名</h2>
        <Input v-if="userInfo.type==0" v-model="userInfo.name" placeholder="Enter name" disabled  />
        <Input v-else v-model="userInfo.name" placeholder="Enter name" />

        <div v-if="userInfo.type == 0">
          <div style="width: 49%; float: left;">
            <h3>学校</h3>
            <AutoComplete v-model="userInfo.school" :data="schools" :filter-method="filterMethod" placeholder="input here" disabled>
            </AutoComplete>
          </div>
          <div style="width: 49%; float: right;">
            <h3>年级</h3>
            <Select v-model="userInfo.grade">
              <Option v-for="item in grades" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
        <div v-else>
          <h3>学校</h3>
          <AutoComplete v-model="userInfo.school" :data="schools" :filter-method="filterMethod" placeholder="input here" disabled>
          </AutoComplete>
        </div>
      </div>

      <div class="div-otherInf">
        <h1>联系方式</h1>
        <h2>邮箱</h2>
        <Input v-model="userInfo.email" placeholder="Enter email.." clearable  />
      </div>

      <div class="div-signature">
        <h2>个性签名</h2>
        <Input v-model="userInfo.signature" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
      </div>

      <Button type="success" style="margin: 5px 0px 5px 0px" @click="updateInfo" long>Submit</Button>
    </div>

    <div class="div-avatar">
      <div>
         <Button type="primary" @click="changeModifyPasswdShow">修改密码</Button>
      <transition name="fade">
        <div class="div-password" v-if="isModifyPassword">
          <h3>原密码</h3>
          <Input placeholder="Enter old password" v-model="passwdItems.oldPasswd" type="password" clearable/>
          <h3>新密码</h3>
          <Input placeholder="Enter new password" v-model="passwdItems.newPasswd" type="password" clearable/>
          <h3>确认密码</h3>
          <Input placeholder="confirm password" v-model="passwdItems.confirmPasswd" type="password" clearable/>
          <Alert class="alert-message" type="error" v-show="passwdItems.newPasswd != passwdItems.confirmPasswd" show-icon>
            两次密码不一致
          </Alert>
        </div>
      </transition>
      </div>
    </div>
  </div>
</template>


<script>
var SHA256 = require("crypto-js/sha256");
export default {
  props: ['userInfo'],
  data() {
    return {
      passwdItems: {
        oldPasswd: '',
        newPasswd: '',
        confirmPasswd: ''
      },

      isModifyPassword: false,

      avatarUrl: '',

      schools:[
        '中山大学'
      ],

      grades:[
        {
          value: 1,
          label: '大一'
        },
        {
          value: 2,
          label: '大二'
        },
        {
          value: 3,
          label: '大三'
        },
        {
          value: 4,
          label: '大四'
        },
      ]

    }

  },


  mounted() {
    if (this.userInfo.avatar) {
      this.avatarUrl = this.userInfo.avatar;
    }
  },

  watch: {
    'userInfo.avatar': function(newVal)  {
      this.avatarUrl = newVal;
    }
  },

  computed: {

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

    fileToDataURL(file, callback) {
      var reader = new FileReader();
      reader.onload = function(e) {callback(e.target.result);};
      reader.readAsDataURL(file);
    },

    avatarImgUpload(event) {
      var imgFile = event.target.files[0];
      if (!imgFile) {
        this.avatarUrl = this.userInfo.avatar;
        return;
      }

      this.fileToDataURL(imgFile, (url) => {
        this.avatarUrl = url;
        let blob = this.dataURLtoBlob(this.avatarUrl)
        let formData = new FormData();
        formData.append("avatar", blob);

        this.$axios({
          method: 'put',
          url: '/api/v1/user/updateAvatar',
          data: formData,
          config: {headers: {'Content-Type': 'multipart/form-data'}}
        })
        .then(msg => {
          if (msg.data.code == 200) {
            this.userInfo.avatar = msg.data.data;
            this.$Message.success('更改头像成功！');
          }
          else {
            this.avatarUrl = this.userInfo.avatar;
            this.$Message.error(msg.data.msg);
          }
        })
        .catch(err => {
          if (err.response.status == 401) {
            this.$router.push({name: 'login'});
            this.$Message.error('请登录');
          }
          else {
            this.avatarUrl = this.userInfo.avatar;
            this.$Message.error(err.response.data.msg);
          }
        });
      });
    },

    filterMethod (value, option) {
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },

    clearPasswdItem() {
      for (var key in this.passwdItems) {
        this.passwdItems[key] = '';
      }
      this.isModifyPassword = false;
    },

    changeModifyPasswdShow() {
      if (this.isModifyPassword) {
        this.clearPasswdItem();
      }
      else {
        this.isModifyPassword = true;
      }
    },

    updateInfo() {
      if (this.isModifyPassword && (!this.passwdItems.oldPasswd || !this.passwdItems.newPasswd)) {
        this.$Message.error('原密码或新密码不能为空！');
        return;
      }

      if (this.isModifyPassword && this.passwdItems.confirmPasswd != this.passwdItems.newPasswd) {
        this.$Message.error('两次密码不一致！');
        return;
      }

      let data = {
        "grade": this.userInfo.grade,
        "phone": this.userInfo.phone,
        "email": this.userInfo.email,
        "signature": this.userInfo.signature
      };
      if (this.userInfo.type == 1) {
        data.name = this.userInfo.name;
      }

      if (this.isModifyPassword && this.passwdItems.confirmPasswd == this.passwdItems.newPasswd) {
        data.oldPasswd = SHA256(this.passwdItems.oldPasswd).toString();
        data.newPasswd = SHA256(this.passwdItems.newPasswd).toString();
      }

      this.$axios({
        method: 'put',
        url: "/api/v1/user/update",
        data: data
      })
      .then(msg => {
        if (msg.data.code == 200) {
          this.$Message.success(msg.data.msg[0]);
          if (msg.data.msg.length > 1) {
            if (msg.data.msg[1].indexOf('成功') != -1) this.$Message.success(msg.data.msg[1]);
            else this.$Message.error(msg.data.msg[1]);
          }
        }
        this.clearPasswdItem();
      })
      .catch(err => {
        this.clearPasswdItem();
        if (err.response.status == 401) {
          this.$router.push({name: `login`});
        }
        this.$Message.error(err.response.data.msg);
      });
    }

  }
}


</script>


<style scoped>
.contain {
  margin: 15px;
  text-align: left;
  position: relative;
}

h1 {
  border-bottom: 1px solid #e1e4e8;
  padding-bottom: 10px;
}

h2, h3 {
  margin: 10px 0;
}

.div-userinfo {
  width: 80%;
  padding: 20px 50px 0 10px;
}

.div-password {
  border: 1px solid ;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
}

.div-basicInf {
  border: 1px solid ;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
  overflow:hidden;
}


.div-otherInf {
  border: 1px solid ;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
}

.div-signature {
  border: 1px solid ;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
  overflow:hidden;
}

  .avatar-box {
    width: 100%;
    height: 150px;
    overflow: hidden;
    margin-top: 20 px;
    position: relative;
  }

  .img-upload-box {
    width: 120px;
    height: 120px;
    line-height: 80px;
    cursor: pointer;
    background: #ffffff;
    border: 1px dashed #dcdee2;
    border-radius: 4px;
    display: inline-block;
    margin-top: 10px;
  }

.div-avatar {
  position: absolute;
  right: 20px;
  top: 100px;
  width: 20%;
}

.div-avatar img {
  width: 100%;
}

.div-edit-avatar {
  background-color: #24292e;
  border-radius: 6px;
  position: absolute;
  color: #fff;
  bottom: 0;
  left:0;
  margin-left: 8px;
  margin-bottom: 8px;
  padding: 8px 4px;
  cursor: pointer;
}

@media screen and (max-width: 800px) {
  .div-avatar {
    display: none;
  }

  .div-userinfo {
    width: 100%;
  }
}


.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
}

.alert-message {
    margin-top:10px;
    margin-bottom: 10px;
}

#fileInput {
  display: none;
}

</style>
