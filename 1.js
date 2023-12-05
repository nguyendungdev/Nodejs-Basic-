const fs = require('fs');

const fetchData = async (path) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/${path}`);
    return response.json();
}

const getUserInfo = (user, posts, comments) => {
    const userPosts = posts.filter(post => post.userId === user.id).map(({ id, title, body }) => ({ id, title, body }));
    const userComments = comments.filter(comment => comment.email === user.email).map(({ id, postId, name, body }) => ({ id, postId, name, body }));
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        comments: userComments,
        posts: userPosts,
    };
}

const getPostWithComment = async () => {
    try {
        const [posts, comments] = await Promise.all([
            fetchData('posts/1'),
            fetchData('comments?postId=1'),
        ]);
        return {
            ...posts,
            comments: comments,
        };
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

const filterComment = (users) => users.filter(user => user.comments.length > 3);

const formatData = (users) => users.map(user => ({
    ...user,
    comments: user.comments.length,
    posts: user.posts.length,
}));

const getHighest = (users) => {
    const highestComment = users.reduce((accumulator, current) => (accumulator.comments > current.comments ? accumulator : current));
    const highestPost = users.reduce((accumulator, current) => (accumulator.posts > current.posts ? accumulator : current));
    return { highestComment, highestPost };
}

const sortByPost = (users) => [...users].sort((a, b) => b.posts - a.posts);

const writeToFile = (fileName, data) => {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 4));
}

async function getUser() {
    try {
        const [users, posts, comments] = await Promise.all([
            fetchData('users'),
            fetchData('posts'),
            fetchData('comments'),
        ]);

        const userData = users.map(user => getUserInfo(user, posts, comments));

        writeToFile('task3.json', userData);
        writeToFile('task4.json', filterComment(userData));
        writeToFile('task5.json', formatData(userData));
        writeToFile('task6.json', getHighest(userData));
        writeToFile('task7.json', sortByPost(userData));
        writeToFile('task8.json', await getPostWithComment());
    } catch (error) {
        console.log(`Error: ${error}`);
        throw error
    }
}

getUser();
