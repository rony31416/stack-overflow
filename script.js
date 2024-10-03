document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');
    const postForm = document.getElementById('post-form');
    const postsDiv = document.getElementById('posts');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                if (response.ok) {
                    alert('Signup successful!');
                    window.location.href = 'signin.html';
                } else {
                    alert('Signup failed. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/signin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    window.location.href = 'home.html';
                } else {
                    alert('Signin failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const content = document.getElementById('post-content').value;
            const token = localStorage.getItem('token');
            
            try {
                const response = await fetch('/post', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ content })
                });
                
                if (response.ok) {
                    alert('Post created successfully!');
                    document.getElementById('post-content').value = '';
                    fetchPosts();
                } else {
                    alert('Failed to create post. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });

        fetchPosts();
    }

    async function fetchPosts() {
        if (!postsDiv) return;

        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch('/post', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const posts = await response.json();
                postsDiv.innerHTML = posts.map(post => `
                    <div class="post">
                        <p>${post.content}</p>
                    </div>
                `).join('');
            } else {
                postsDiv.innerHTML = '<p>Failed to fetch posts.</p>';
            }
        } catch (error) {
            console.error('Error:', error);
            postsDiv.innerHTML = '<p>An error occurred while fetching posts.</p>';
        }
    }
});
