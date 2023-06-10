Vue.component('login-page', {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    login() {
      // Perform authentication logic here
      // For simplicity, let's assume the login is successful
      if (this.username !== '') {
        this.$emit('login', this.username); // Emit the username when logging in
      } else {
        this.errorMessage = 'Please enter a username and password';
      }
    }
  },
  template: `
    <div class="login-container">
      <form class="login-form">
        <h1 class="login-heading">Login</h1>
        <div class="login-image">
          <img src="profilePicture1.jpg" alt="Login Image" class="profile-picture">
        </div>
        <input class="login-input" v-model="username" type="text" placeholder="Username" required>
        <input class="login-input" v-model="password" type="password" placeholder="Password" required>
        <button class="login-button" @click="login">Sign In</button>
        <p v-if="errorMessage" class="login-error">{{ errorMessage }}</p>
      </form>
    </div>
  `
});

Vue.component('timeline-page', {
  props: ['username'],
  data() {
    return {
      posts: [],
      postContent: '',
      selectedMood: '',
      profilePicture: 'profilePicture1.jpg',
      editingPostId: null,
      showProfileSection: false,
      likedPosts: [],
      currentPage: 1,
      postsPerPage: 5
    };
  },
  methods: {
    toggleProfileSection() {
      this.showProfileSection = !this.showProfileSection;
    },
  
    addPost() {
      if (this.editingPostId) {
        // Update existing post
        const post = this.posts.find(p => p.id === this.editingPostId);
        if (post) {
          post.content = this.postContent;
          post.dateEdited = new Date().toLocaleString();
        }
      } else {
        // Add new post
        const newPost = {
          id: Date.now(),
          username: this.username,
          content: this.postContent,
          mood: this.selectedMood,
          profilePicture: this.profilePicture,
          date: new Date().toLocaleString(),
          dateEdited: ''
        };
        this.posts.unshift(newPost);
      }
  

      this.postContent = '';
      this.selectedMood = '';
      this.editingPostId = null;
    },
  

    editPost(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        this.postContent = post.content;
        this.editingPostId = postId;
      }
    },

    updateUsername(username) {
      this.username = username;
    },

    deletePost(postId) {
      this.posts = this.posts.filter(post => post.id !== postId);
    },

    likePost(postId) {
      const index = this.likedPosts.indexOf(postId);
      if (index === -1) {
        // Post is not liked, add to likedPosts
        this.likedPosts.push(postId);
      } else {
        // Post is already liked, remove from likedPosts
        this.likedPosts.splice(index, 1);
      }
    },

    selectMood(mood) {
      this.selectedMood = mood;
    },

    updateProfilePicture(picture) {
      this.profilePicture = picture;
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
    },

    changePage(page) {
      this.currentPage = page;
    }
  },
  computed: {
    pagedPosts() {
      const startIndex = (this.currentPage - 1) * this.postsPerPage;
      return this.posts.slice(startIndex, startIndex + this.postsPerPage);
    }
  },
  template: `
    <div class="timeline-container">
      <div class="post-section">
        <h2>Welcome, {{ username }}!</h2>
        <div class="form">
          <textarea v-model="postContent" placeholder="What's on your mind?"></textarea>
          <div class="mood-icons">
            <i class="far fa-smile" @click="selectMood('happy')" :class="{ 'selected': selectedMood === 'happy' }"></i>
            <i class="far fa-frown" @click="selectMood('sad')" :class="{ 'selected': selectedMood === 'sad' }"></i>
            <i class="far fa-angry" @click="selectMood('angry')" :class="{ 'selected': selectedMood === 'angry' }"></i>
          </div>
          <button v-if="!editingPostId" @click="addPost">Add Post</button>
          <button v-if="editingPostId" @click="addPost">Update Post</button>
          <button @click="toggleProfileSection">Edit Profile</button>
        </div>

        <div class="timeline">
          <div v-for="post in pagedPosts" :key="post.id" class="post">
            <div class="post-header">
              <img class="profile-picture" :src="post.profilePicture" alt="Profile Picture">
              <span class="username">{{ post.username }}</span>
              <span class="date">{{ post.date }}</span>
            </div>
            <div class="post-content">
              <p>{{ post.content }}</p>
            </div>
            <div class="post-footer">
              <i class="heart-icon"
                :class="{'far fa-heart': likedPosts.indexOf(post.id) === -1, 'fas fa-heart': likedPosts.indexOf(post.id) !== -1}"
                @click="likePost(post.id)"
              ></i>
              <span class="date-edited">{{ post.dateEdited }}</span>
              <button @click="deletePost(post.id)">Delete</button>
              <button @click="editPost(post.id)">Edit</button>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button v-if="currentPage > 1" @click="changePage(currentPage - 1)">Previous Page</button>
          <button v-if="currentPage < Math.ceil(posts.length / postsPerPage)" @click="changePage(currentPage + 1)">Next Page</button>
        </div>
      </div>

      <div class="profile-section" v-if="showProfileSection">
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
      isLoggedIn: false,
      username: '',
      password: ''
    };
  },
  methods: {
    login(username) {
      this.isLoggedIn = true;
      this.username = username;
    }
  }
});
