<template>
  <div class="add-course">
    <h2>Add course</h2>
    <form @submit.prevent="submitCourse">
      <input type="text" v-model="name" placeholder="Course name" />
      <textarea placeholder="Course details" rows="3" v-model="details"></textarea>
      <input type="text" v-model="location" placeholder="Location" />
      <input type="datetime-local" v-model="dateTime" />
      <input type="number" v-model="duration" placeholder="Duration (hours)" />
      <input type="number" v-model="maxParticipants" placeholder="Seats available" />
      <input type="text" v-model="domain" placeholder="Domain" />
      <button type="submit">Submit course</button>
      <p
        :class="{'success': isAddCourseSuccessful, 'error': !isAddCourseSuccessful ,  message}"
        v-if="message"
      >{{ message }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: "AddCourse",
  props: {
    userProfile: Object
  },
  data: () => ({
    name: "",
    details: "",
    location: "",
    dateTime: "",
    duration: "",
    maxParticipants: "",
    domain: "",
    message: "",
    isAddCourseSuccessful: false
  }),
  methods: {
    async submitCourse() {
      try {
        const courseData = {
          name: this.name,
          details: this.details,
          location: this.location,
          dateTime: new Date(this.dateTime).getTime(),
          duration: this.duration,
          maxParticipants: this.maxParticipants,
          domain: this.domain,
          teacherPhoneNumber: this.userProfile.phoneNumber
        };

        await fetch(`${this.$root.apiUrl}/courses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(courseData)
        }).then(response => {
          if (response.status !== 201) {
            throw new Error(response.message);
          }

          this.name = "";
          this.details = "";
          this.location = "";
          this.dateTime = "";
          this.duration = "";
          this.maxParticipants = "";
          this.domain = "";
        });

        this.isAddCourseSuccessful = true;
        this.message = "Your course has been added";

        this.$emit("course-added");
      } catch (e) {
        this.isAddCourseSuccessful = false;
        this.message = "Your course could not be added";
      }
    }
  }
};
</script>

<style scoped>
</style>
