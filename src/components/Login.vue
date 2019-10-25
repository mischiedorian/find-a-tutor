<template>
  <div class="login">
    <h2>Login</h2>
    <form>
      <div class="toggle">
        <span @click="checkUserType" :class="{'selected': !isUserTeacher}">Student</span>
        <input type="checkbox" v-model="isUserTeacher" />
        <span @click="checkUserType" :class="{'selected': isUserTeacher}">Teacher</span>
      </div>
      <input type="tel" v-model="phoneNumber" placeholder="Phone number" />
      <button type="submit" @click="doLogin">Login</button>
      <p class="error message" v-if="message">{{ message }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
    phoneNumber: "",
    isUserTeacher: false,
    message: ""
  }),
  methods: {
    async doLogin(e) {
      e.preventDefault();

      const apiPath = this.isUserTeacher ? "teachers" : "students";
      const userProfile = await fetch(
        `${this.$root.apiUrl}/${apiPath}/${this.phoneNumber}`
      )
        .then(response => {
          if (response.status !== 200) {
            throw new Error(response.message);
          }

          return response.json();
        })
        .catch(() => {
          this.isLoginSuccessful = false;
          this.message = "Could not login";
        });

      this.setProfile(userProfile);
    },

    setProfile(userProfile) {
      window.localStorage.setItem("user-profile", JSON.stringify(userProfile));
      this.$emit("login", true);
    },

    checkUserType(e) {
      if (e.target.innerText == "Teacher") {
        this.isUserTeacher = true;
      } else {
        this.isUserTeacher = false;
      }
    }
  }
};
</script>

<style scoped>
</style>
