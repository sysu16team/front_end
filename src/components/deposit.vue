<template>
  <div class="contain">
    <p class="p-balance">
      账户余额：<span class="span-balance">{{userInfo.money}}</span> 元
    </p>
    <p class="p-amount">充值金额</p>
    <div style="overflow: hidden;">
      <div class="select-amount custom-amount" :class="{'is-selected': money == ''}">
        <input v-model="customInputMoney" placeholder="充值金额" @click="money=''"/>元
      </div>
       <Button type="info" class="pay-button" @click="confirm">立即充值</Button>
    </div>
        <Modal
          v-model="isModalShow"
          title="确认充值"
                    @on-ok="ok"
                    @on-cancel="cancel"
                    :loading="loading">
          <p class="pay-amount">支付金额：<span>￥{{amount}}</span></p>
        </Modal>
  </div>
</template>


<script>
  export default {
    props: ['userInfo'],
    data() {
      return {
        money: '0',
        customInputMoney: '',
        isModalShow:false,
      }



    },

    mounted() {

    },

    computed: {
      amount() {
        return this.money || this.customInputMoney;
      }
    },

    methods: {
      confirm() {
        if(this.customInputMoney!=0)
          this.isModalShow=true;
      },
      ok(){
         this.$axios.get('api/v1/user/deposit?amount='+this.amount).then(msg => {
          if (msg.data.code == 200) {
            this.$Message.success(msg.data.msg);
            this.userInfo.money = msg.data.data;
          }
          else {
            this.$Message.error(msg.data.msg);
          }
        }).catch(err => {
          this.$Message.error(err.response.statusText);
        });
         this.isModalShow=false;
      },

      deposit() {
        this.$axios.get('api/v1/user/deposit?amount='+this.amount).then(msg => {
          if (msg.data.code == 200) {
            this.$Message.success(msg.data.msg);
            this.userInfo.money = msg.data.data;
          }
          else {
            this.$Message.error(msg.data.msg);
          }
        }).catch(err => {
          this.$Message.error(err.response.statusText);
        });
      }
    }
  }


</script>


<style scoped>
.contain {
  margin: 15px;
  text-align: left;
}

.p-balance {
  background: #f1f1f1;
  line-height: 36px;
  padding: 0 15px;
}

.span-balance {
  color: #ff9900;
  vertical-align: bottom;
  font-size: 24px;
  font-weight: 600;
}

.p-amount, .pay-amount{
  margin: 15px 8px;
  font-size: 16px;
  color: #99a2aa;
}

.select-amount {
  float: left;
  width: 200px;
  height: 80px;
  margin: 0 8px 16px 8px;
  border: 1px solid #e7ecf1;
  border-radius: 4px;
  line-height: 80px;
  text-align: center;
  font-size: 24px;
  cursor: pointer;
}

.custom-amount {
  width: 416px;
  text-align: left;
}

.custom-amount input {
  width: 80%;
  height: 80%;
  border: none;
  outline: none;
  padding-left: 20px;
}

.is-selected {
  border-color:  #0099ff;
  color:  #0099ff;
}


.pay-amount span {
  width: 200px;
  font-size: 32px;
  color: #0099ff;
}

.pay-button {
  margin-top: 20px;
  margin-left:100px;
  width: 100px;
  height: 40px;
  border-radius: 10px;
  font-size: 16px;

}

input {
  background: transparent;
}
</style>
