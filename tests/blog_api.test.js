const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const blogsInDb = require('../utils/blogdelete_helper')

const testBlogs = [
  {
    title: "juu",
    author: "joku",
    url: "jokuosote",
    likes: 7
  },
  {
    title: "juu2",
    author: "joku2",
    url: "jokuosote2",
    likes: 5
  }
]

beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = testBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "testiblogi",
    author: "testi",
    url: "jokuosote6",
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(response.body.length).toBe(testBlogs.length + 1)
  expect(contents).toContain('testiblogi')
})





describe('deletion of a blog', async () => {
  let addedBlog

  beforeAll(async () => {
    addedblog = new Blog({
      title: "testiblogi2",
      author: "testi2",
      url: "jokuosote7",
      likes: 9
    })
    await addedBlog.save()
  })

  test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
    const blogsAtStart = await blogsInDb()

    await api
      .delete(`/api/blogs/${addedBlog._id}`)
      .expect(204)

    const blogsAfterOperation = await blogsInDb()

    const contents = blogsAfterOperation.map(r => r.title)

    expect(contents).not.toContain(addedBlog.title)
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
  })
})



afterAll(() => {
  console.log('toimii')
  server.close();
  console.log('toimii2')
})
