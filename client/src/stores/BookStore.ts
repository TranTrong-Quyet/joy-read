import { ref, type Ref } from 'vue'
import { axiosMainApi } from '@/api/axios.express'
import { axiosDjango } from '@/api/axios.django'

import { defineStore } from 'pinia'

interface Book {
  title: string
  content: string
  audioUrlOnl?: string
}

interface AddBookState {
  book: Book
  message: string
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

export type { Book }

const useAddBookStore = defineStore('addBook', () => {
  const initialState: Ref<AddBookState> = ref({
    book: {
      title: '',
      content: '',
      audioUrlOnl: undefined,
    },
    message: '',
    isLoading: false,
    isSuccess: false,
    isError: false,
  })

  const addBook = async (book: Book) => {
    try {
      const response = await axiosMainApi.post('/api/book/create', book)
      console.log('Post book')
      if (!response) {
        initialState.value.message = 'Error creating book'
      }

      initialState.value.book.title = response.data.book.title
      initialState.value.book.content = response.data.book.content

      if (response.data.book.audioUrlOnl) {
        initialState.value.book.audioUrlOnl = response.data.book.audioUrlOnl
      }
      console.log(response.data)
    } catch (error: unknown) {
      console.error((error as Error).message)
    } finally {
      initialState.value.isLoading = false
    }
  }

  const addBookDirectFromStore = async () => {
    try {
      const book = initialState.value.book
      initialState.value.isLoading = true
      const response = await axiosMainApi.post('/api/book/create', book)
      if (!response) {
        initialState.value.isError = true
        initialState.value.message = 'Error occur when creating book'
      }

      initialState.value.book.content = response.data.book.content
      initialState.value.book.title = response.data.book.title
      initialState.value.message = response.data.message
    } catch (error: unknown) {
      console.error('Error add book from pinia store:', (error as Error).message)
      initialState.value.message = 'Error occur when creating book'
    }
  }

  const getTranscriptFromYoutube = async (values: { videoLink: string; lang: string }) => {
    try {
      const response = await axiosDjango.post('/api/get-transcript/', values)
      if (response.data && response.data.transcript) {
        initialState.value.book.content = response.data.transcript
          .map((item: { text: string }) => item.text)
          .join(' ')
      }
    } catch (error: unknown) {
      console.log('Error', (error as Error).message)
    }
  }

  const updateBook = (values: Book) => {
    initialState.value.book.title = values.title ?? ''
    initialState.value.book.content = values.content ?? ''
    initialState.value.book.audioUrlOnl = values.audioUrlOnl ?? ''
  }

  const getPdfText = async (formData: FormData) => {
    try {
      const response = await axiosMainApi.post('/api/book/get-pdf-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('axios works, from store')
      console.log(response.data.trim())
      if (response.data) {
        initialState.value.message = 'Extract text from PDF successfully'
      }
      initialState.value.book.content = response.data.trim()
    } catch (error) {
      console.error('Error getting text from pdf file:', (error as Error).message)
      alert('Failed to extract text. Please check the server logs.')
    } finally {
      initialState.value.isLoading = false
    }
  }

  return {
    initialState,
    addBook,
    updateBook,
    getTranscriptFromYoutube,
    getPdfText,
    addBookDirectFromStore,
  }
})

export { useAddBookStore }
