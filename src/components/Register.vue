<template>
  <div class="register">
    <h2>Register</h2>
    <form>
      <div class="toggle">
        <span @click="checkUserType" :class="{'selected': !isUserTeacher}">Student</span>
        <input type="checkbox" v-model="isUserTeacher" />
        <span @click="checkUserType" :class="{'selected': isUserTeacher}">Teacher</span>
      </div>
      <input type="tel" v-model="phoneNumber" placeholder="Phone number" />
      <input type="text" v-model="firstName" placeholder="First name" />
      <input type="text" v-model="lastName" placeholder="Last name" />
      <input type="text" v-model="skills" placeholder="Skills" v-if="isUserTeacher" />
      <input type="text" v-model="faculty" placeholder="Faculty" v-if="!isUserTeacher" />
      <button type="submit" @click="doRegister">Register</button>
      <p
        :class="{'success': isRegisterSuccessful, 'error': !isRegisterSuccessful ,  message}"
        v-if="message"
      >{{ message }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: "Register",
  data: () => ({
    phoneNumber: "",
    firstName: "",
    lastName: "",
    skills: "",
    faculty: "",
    isUserTeacher: false,
    message: "",
    isRegisterSuccessful: false
  }),
  methods: {
    async doRegister(e) {
      e.preventDefault();

      try {
        const apiPath = this.isUserTeacher ? "teachers" : "students";
        const userData = {
          phoneNumber: this.phoneNumber,
          firstName: this.firstName,
          lastName: this.lastName
        };

        if (this.isUserTeacher) {
          userData.skills = this.skills;
        } else {
          userData.faculty = this.faculty;
        }

        await fetch(`${this.$root.apiUrl}/${apiPath}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData)
        }).then(response => {
          if (response.status !== 201) {
            throw new Error(response.message);
          }
        });

        this.isRegisterSuccessful = true;
        this.message = "Your account has been created";
      } catch (e) {
        this.isRegisterSuccessful = false;
        this.message = "Could not create account";
      }
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
