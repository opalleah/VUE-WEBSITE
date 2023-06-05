    Vue.component('login-page', {
      data() {
        return {
          username: '',
          password: ''
        }
      },
      methods: {
        login() {
          // Perform authentication logic here
          // For simplicity, let's assume the login is successful
          if (this.username !== '') {
            this.$emit('login');
          }
        }
      },
      template: `
        <div>
          <h1 class="login-heading">Login</h1>
          <input v-model="username" type="text" placeholder="Username" required>
          <input v-model="password" type="password" placeholder="Password">
          <button @click="login">Sign In</button>
        </div>
      `
    });

    Vue.component('timeline-page', {
      data() {
        return {
          posts: [],
          postContent: '',
          selectedMood: '',
          profilePicture: 'profilePicture1.jpg',
          username: '',
          editingPostId: null
        }
      },
      methods: {
        addPost() {
          const newPost = {
            id: Date.now(),
            username: this.username,
            content: this.postContent,
            mood: this.selectedMood,
            date: new Date().toLocaleString(),
            dateEdited: ''
          };

          this.posts.unshift(newPost);
          this.postContent = '';
          this.selectedMood = '';
        },
        deletePost(postId) {
          this.posts = this.posts.filter(post => post.id !== postId);
        },
        selectMood(mood) {
          this.selectedMood = mood;
        },
        updateProfilePicture(picture) {
          this.profilePicture = picture;
        },
        updateUsername(newUsername) {
          this.username = newUsername;
        },
        editPost(postId) {
          this.editingPostId = postId;
        },
        updatePost(post) {
          post.dateEdited = new Date().toLocaleString();
          this.editingPostId = null;
        },
        cancelEdit() {
          this.editingPostId = null;
        },
        getMoodIcon(mood) {
          if (mood === 'happy') {
            return 'far fa-smile';
          } else if (mood === 'sad') {
            return 'far fa-frown';
          } else if (mood === 'angry') {
            return 'far fa-angry';
          } else {
            return '';
          }
        }
      },
      template: `
        <div class="timeline-container">
          <div class="post-section">
            <h2>Add a Post</h2>
            <div class="form">
              <textarea v-model="postContent" placeholder="What's on your mind?"></textarea>
              <div class="mood-icons">
                <i class="far fa-smile" @click="selectMood('happy')" :class="{ 'selected': selectedMood === 'happy' }"></i>
                <i class="far fa-frown" @click="selectMood('sad')" :class="{ 'selected': selectedMood === 'sad' }"></i>
                <i class="far fa-angry" @click="selectMood('angry')" :class="{ 'selected': selectedMood === 'angry' }"></i>
              </div>
              <button @click="addPost">Add Post</button>
            </div>
            
            <div class="timeline">
              <div v-for="post in posts" :key="post.id" class="post">
                <div class="post-header">
                  <span class="username">{{ post.username }}</span>
                  <span class="date">{{ post.date }}</span>
                </div>
                <div class="post-content">
                  <p>{{ post.content }}</p>
                </div>
                <div class="post-footer">
                  <i :class="getMoodIcon(post.mood)"></i>
                  <span class="date-edited">{{ post.dateEdited }}</span>
                  <button @click="deletePost(post.id)">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <div class="profile-section">
            <h2>Edit Profile</h2>
            <div>
              <img class="profile-picture" :src="profilePicture" alt="Profile Picture">
              <div class="profile-picture-list">
                <img class="profile-picture-item" src="profilePicture1.jpg" alt="Profile Picture 1" @click="updateProfilePicture('profilePicture1.jpg')">
                <img class="profile-picture-item" src="profilePicture2.jpg" alt="Profile Picture 2" @click="updateProfilePicture('profilePicture2.jpg')">
                <img class="profile-picture-item" src="profilePicture3.jpg" alt="Profile Picture 3" @click="updateProfilePicture('profilePicture3.jpg')">
                <img class="profile-picture-item" src="profilePicture4.jpg" alt="Profile Picture 3" @click="updateProfilePicture('profilePicture4.jpg')">
              </div>
              <div>
                <label for="username">Username:</label>
                <input id="username" v-model="username" type="text">
              </div>
              <button @click="updateUsername(username)">Save</button>
            </div>
          </div>
        </div>
      `
    });

    new Vue({
      el: '#app',
      data() {
        return {
          isLoggedIn: false
        }
      },
      methods: {
        login() {
          this.isLoggedIn = true;
        }
      }
    });