//Login Page Component
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
      // For simplicity, let's assume the login is always successful
      if (this.username !== '') {
        this.$emit('login', this.username); // Emit the username when logging in
      } else {
        this.errorMessage = 'Please enter a username and password'; //Error message if user does not enter a username
      }
    }
  },
  //Template for Login In screen
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

//Timeline Page Component
Vue.component('timeline-page', {
  props: ['username'],
  data() {
    return {
      // Data properties for the component
      posts: [], // Array to store the posts
      postContent: '',
      selectedMood: '',
      profilePicture: 'profilePicture1.jpg', //Give user default profile picture
      editingPostId: null, // ID of the post being edited (null if no post is being edited)
      showProfileSection: false, // Controls the visibility of the profile section - set to false at first
      likedPosts: [],
      currentPage: 1, // Current page number for pagination
      postsPerPage: 5, // Number of posts to display per page
      searchKeyword: ''
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
          post.dateEdited = new Date().toLocaleString(); //Add an edit date to post when edited
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
      // Returns the icon class based on the selected mood
      if (mood === 'happy') {
        return 'far fa-smile';
      } else if (mood === 'sad') {
        return 'far fa-frown';
      } else if (mood === 'angry') {
        return 'far fa-angry';
      } else if (mood === 'excited') {
        return 'far fa-grin-stars';
      } else if (mood === 'calm') {
        return 'far fa-smile-beam';
      } else if (mood === 'confused') {
        return 'far fa-surprise';
      } else if (mood === 'love') {
        return 'far fa-heart';
      } else if (mood === 'surprised') {
        return 'far fa-surprise';
      } else {
        return '';
      }
    },

    changePage(page) {
      this.currentPage = page;
    },

    filterByMood(mood) {
      this.selectedMood = mood;
    },

    resetMoodFilter() {
      this.selectedMood = '';
    }
  },
  computed: {
    filteredPosts() {
      const keyword = this.searchKeyword.toLowerCase();
      return this.posts.filter(post => {
        const content = post.content.toLowerCase();
        const username = post.username.toLowerCase();
        const mood = post.mood.toLowerCase();
        const keywordMatches = content.includes(keyword) || username.includes(keyword);
        const moodMatches = this.selectedMood === '' || mood === this.selectedMood;
        return keywordMatches && moodMatches;
      });
    },
    pagedPosts() {
      const startIndex = (this.currentPage - 1) * this.postsPerPage;
      return this.filteredPosts.slice(startIndex, startIndex + this.postsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredPosts.length / this.postsPerPage);
    }
  },
  //Timeline page template
  template: `
    <div class="timeline-container">
      <div class="post-section">
        <img class="profile-picture" :src="profilePicture" alt="Profile Picture">
        <h2>Welcome, {{ username }}!</h2>
        <div class="form">
          <textarea v-model="postContent" placeholder="What's on your mind?"></textarea>
          <div class="mood-icons">
            <i class="far fa-smile" @click="selectMood('happy')" :class="{ 'selected': selectedMood === 'happy' }"></i>
            <i class="far fa-frown" @click="selectMood('sad')" :class="{ 'selected': selectedMood === 'sad' }"></i>
            <i class="far fa-angry" @click="selectMood('angry')" :class="{ 'selected': selectedMood === 'angry' }"></i>
            <i class="far fa-grin-stars" @click="selectMood('excited')" :class="{ 'selected': selectedMood === 'excited' }"></i>
            <i class="far fa-smile-beam" @click="selectMood('calm')" :class="{ 'selected': selectedMood === 'calm' }"></i>
            <i class="far fa-surprise" @click="selectMood('confused')" :class="{ 'selected': selectedMood === 'confused' }"></i>
            <i class="far fa-heart" @click="selectMood('love')" :class="{ 'selected': selectedMood === 'love' }"></i>
            <i class="far fa-surprise" @click="selectMood('surprised')" :class="{ 'selected': selectedMood === 'surprised' }"></i>
          </div>
          <button v-if="!editingPostId" @click="addPost">Add Post</button>
          <button v-if="editingPostId" @click="addPost">Update Post</button>
          <button @click="toggleProfileSection">Edit Profile</button>
          <input type="text" v-model="searchKeyword" placeholder="Search posts">
          <div class="mood-buttons">
            <button @click="resetMoodFilter" :class="{ 'active': selectedMood === '' }">All Moods</button>
          </div>
        </div>
        
        <div v-if="filteredPosts.length === 0" class="timeline-no-posts">
          No posts found.
        </div>

        <div class="timeline">
          <div v-for="post in pagedPosts" :key="post.id" class="post">
            <div class="post-header">
              <img class="profile-picture" :src="post.profilePicture" alt="Profile Picture">
              <div>
                <h4 class="username">{{ post.username }}</h4>
                <p class="date">Date Posted: {{ post.date }}</p>
              </div>
            </div>
            <div class="post-content">
              <p>{{ post.content }}</p>
              <span class="mood" v-if="post.mood">
                <p class="mood">
                  Mood: <i :class="getMoodIcon(post.mood)"></i>
                </p>
              </span>
            </div>
            <div class="post-footer">
              <i class="heart-icon"
                :class="{'far fa-heart': likedPosts.indexOf(post.id) === -1, 'fas fa-heart': likedPosts.indexOf(post.id) !== -1}"
                @click="likePost(post.id)"
              ></i>
              <p v-if="post.dateEdited" class="date-edited">Edited: {{ post.dateEdited }}</p>
              <button @click="deletePost(post.id)">Delete</button>
              <button @click="editPost(post.id)">Edit</button>
            </div>
          </div>
        </div>

        <div class="timeline-pagination">
          <button
            v-for="page in totalPages"
            :key="page"
            :class="['timeline-page-button', { 'timeline-page-active': currentPage === page }]"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
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
              <input id="username" v-model="username" type="text" required>
            </div>
            <button @click="toggleProfileSection">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  `
});

// Main App
const app = new Vue({
  el: '#app', 

  data: {
    // Data properties for the app
    currentPage: 'login', // Keeps track of the current page (login or timeline)
    loggedIn: false, // Indicates whether the user is logged in or not
    username: '' // Stores the username of the user
  },

  methods: {
    // Methods used in the app
    login(username) {
      // Method to handle the login event triggered by the login page component
      this.loggedIn = true; 
      this.username = username; // Store the username as property
      this.currentPage = 'timeline'; // Switch to the timeline page
    }
  },

  template: `
    <div>
      <login-page v-if="!loggedIn" @login="login"></login-page> 
      <!-- Render the login page component if the user is not logged in -->
      
      <timeline-page v-if="loggedIn" :username="username"></timeline-page>
      <!-- Render the timeline page component if the user is logged in -->
    </div>
  `
});

