<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <div id="particles-js"></div>
        <q-card
          class="login-form"
          v-bind:style="
            $q.platform.is.mobile ? { width: '80%' } : { width: '30%' }
          "
        >
          <q-img src="https://cltdownload.anrunlu.net/pharmacy.jpg"></q-img>
          <q-card-section>
            <q-avatar
              size="74px"
              class="absolute"
              style="top: 0;right: 25px;transform: translateY(-50%);"
            >
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">
                Log in to Dashboard
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit="handleLogin">
              <q-input filled v-model="model.email" label="Username" lazy-rules />

              <q-input
                type="password"
                filled
                v-model="model.password"
                label="Password"
                lazy-rules
              />

              <div>
                <q-btn
                  label="Login"
                  type="submit"
                  color="primary"
                  :loading="btnLoading"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script type="text/javascript"></script>
<script>
export default {
  data() {
    return {
      btnLoading: false,
      model: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async handleLogin() {
      try {
        this.btnLoading = true;
        await this.$store.dispatch("user/userLogin", this.model);

        // 延时一下，为了取到 user/nickname
        // https://blog.csdn.net/qq_41042845/article/details/98845957
        setTimeout(() => {
          const nickname = this.$store.getters["user/nickname"];
          this.$q.notify({
            message: `欢迎回来，${nickname}`,
            color: "positive",
            icon: "done",
            position: "center",
            timeout: 2000
          });
        }, 500);

        this.$router.push(this.$route.query.redirect || "/").catch(e => {});
        this.btnLoading = false;
      } catch (error) {
        this.btnLoading = false;
      }
    }
  }
};
</script>

<style>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, rgb(74, 94, 137) 15%, #b61924 70%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}

.login-form {
  position: absolute;
}
</style>
