<template>
  <main id="app">
    <h1>Find-A-Tutor</h1>
    <div id="account-access" v-if="!isLoggedIn">
      <Login class="card" @login="loadProfile" />
      <Register class="card" @register="loadProfile" />
    </div>
    <div id="course-management" v-if="isLoggedIn">
      <Courses
        ref="courseList"
        class="card"
        :userProfile="userProfile"
        :isUserTeacher="isUserTeacher"
        @course-enroll="refreshCourses"
      />
      <aside>
        <AddCourse
          class="card"
          v-if="isUserTeacher"
          :userProfile="userProfile"
          @course-added="refreshCourses"
        />
        <Courses
          ref="userCourses"
          class="card"
          v-if="!isUserTeacher"
          :userProfile="userProfile"
          :isUserTeacher="isUserTeacher"
          @course-unenroll="refreshCourses"
          only-mine
        />
      </aside>
    </div>
    <button class="logout" v-if="isLoggedIn" @click="logout">🚪Logout</button>
  </main>
</template>

<script>
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import AddCourse from "./components/AddCourse.vue";
import Courses from "./components/Courses.vue";

export default {
  name: "app",
  components: {
    Login,
    Register,
    AddCourse,
    Courses
  },
  data: () => ({
    userProfile: null
  }),
  computed: {
    isLoggedIn() {
      return this.userProfile !== null;
    },
    isUserTeacher() {
      return this.isLoggedIn && !!this.userProfile.skills;
    }
  },
  created() {
    this.userProfile = this.getUserProfile();
  },
  methods: {
    loadProfile(e) {
      if (e === true) {
        try {
          this.userProfile = this.getUserProfile();
        } catch {
          alert("Something went wrong while logging in");
        }
      }
    },
    getUserProfile() {
      try {
        return JSON.parse(window.localStorage.getItem("user-profile"));
      } catch {
        return null;
      }
    },
    refreshCourses() {
      if (this.$refs.courseList) {
        this.$refs.courseList.getCourses();
      }
      if (this.$refs.userCourses) {
        this.$refs.userCourses.getMyCourses();
      }
    },
    logout() {
      window.localStorage.removeItem("user-profile");
      this.userProfile = null;
    }
  }
};
</script>

<style>
@import url("./assets/common.css");

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

#account-access,
#course-management {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
}

#account-access > *,
#course-management > * {
  margin: 1rem;
}

#account-access > *:not(:last-child) {
  border-right: 1px solid #ccc;
  padding-right: 1rem;
  margin-right: 0;
}

.logout {
  position: absolute;
  right: 1rem;
}
</style>
