<template>
  <div class="course">
    <h2>{{ onlyMine ? 'My' : 'Available'}} Courses</h2>
    <p v-if="!courses.length">No courses added yet</p>
    <div class="scroll-box">
      <ul>
        <li v-for="course in courses" :key="course.id">
          <div class="content">
            <span class="title">
              <strong>{{ course.name }}</strong>
            </span>
            <span>
              <small>{{ course.details }}</small>
            </span>
            <div class="group">
              <span>
                <small>📍{{ course.location }}</small>
              </span>
              <span>
                <small>📅{{ course.dateTime }}</small>
              </span>
            </div>
            <div class="group">
              <span>
                <small>👥{{ course.participants }}/{{ course.maxParticipants }}</small>
              </span>
              <span>
                <small>🕘{{ course.duration }} hour(s)</small>
              </span>
              <span>
                <small>🎯{{ course.domain }}</small>
              </span>
            </div>
          </div>
          <div class="actions">
            <button v-if="!isUserTeacher && !onlyMine" @click="enroll(course)">Enroll</button>
            <button v-if="!isUserTeacher && onlyMine" @click="unenroll(course)">Unenroll</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Courses",
  props: {
    onlyMine: Boolean,
    userProfile: Object,
    isUserTeacher: Boolean
  },
  data: () => ({
    courses: []
  }),
  created() {
    if (this.onlyMine) {
      this.getMyCourses();
    } else {
      this.getCourses();
    }
  },
  methods: {
    async getMyCourses() {
      const { courses } = await fetch(
        `${this.$root.apiUrl}/students/${this.userProfile.phoneNumber}/courses`
      ).then(response => {
        if (![200, 404].includes(response.status)) {
          throw new Error(response.message);
        }

        return response.json();
      });

      this.courses = courses;
      return courses;
    },
    processCourse(course) {
      course.dateTime = new Date(parseInt(course.dateTime)).toLocaleString();
      return course;
    },
    async getCourses() {
      let { courses } = await fetch(`${this.$root.apiUrl}/courses`).then(
        response => {
          if (response.status !== 200) {
            throw new Error(response.message);
          }

          return response.json();
        }
      );

      if (!this.isUserTeacher) {
        const enrolledCourses = await this.getMyCourses();
        courses = courses.filter(
          course => !enrolledCourses.find(eCourse => eCourse.id === course.id)
        );
      }

      this.courses = courses.map(this.processCourse);
      return courses;
    },
    async enroll(course) {
      try {
        await fetch(
          `${this.$root.apiUrl}/students/${this.userProfile.phoneNumber}/courses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ idCourse: course.id })
          }
        ).then(response => {
          if (response.status !== 200) {
            throw new Error(response.message);
          }

          this.$emit("course-enroll");
        });
      } catch {
        alert("There was a problem while enrolling. Please try again later.");
      }
    },
    async unenroll(course) {
      try {
        await fetch(
          `${this.$root.apiUrl}/students/${this.userProfile.phoneNumber}/courses/${course.id}`,
          {
            method: "DELETE"
          }
        ).then(response => {
          if (response.status !== 200) {
            throw new Error(response.message);
          }

          this.$emit("course-unenroll");
        });
      } catch {
        alert("There was a problem while unenrolling. Please try again later.");
      }
    }
  }
};
</script>

<style scoped>
ul {
  padding: 0;
  margin: 0;
}
li {
  display: flex;
  flex-direction: column;
  padding: 0 0.25rem;
}

li:not(:last-child) {
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.group > *:not(:last-child) {
  margin-right: 1rem;
}

.title {
  display: block;
  margin-bottom: 0.25rem;
}

.actions {
  margin-top: 0.5rem;
  display: flex;
}

.actions button {
  background: #ff6200;
}

.actions > *:not(:last-child) {
  margin-right: 0.5rem;
}
</style>
