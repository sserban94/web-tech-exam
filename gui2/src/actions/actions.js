import { SERVER } from '../config/global'

export const GET_VIRTUALSHELF = 'GET_VIRTUALSHELF'
export const GET_VIRTUALSHELVES = 'GET_VIRTUALSHELVES'
export const ADD_VIRTUALSHELF = 'ADD_VIRTUALSHELF'
export const UPDATE_VIRTUALSHELF = 'UPDATE_VIRTUALSHELF'
export const DELETE_VIRTUALSHELF = 'DELETE_VIRTUALSHELF'

export const GET_BOOK = 'GET_BOOK'
export const GET_BOOKS = 'GET_BOOKS'
export const ADD_BOOK = 'ADD_BOOK'
export const UPDATE_BOOK = 'UPDATE_BOOK'
export const DELETE_BOOK = 'DELETE_BOOK'


export const getVirtualShelf=()=> {
  return {
      type: GET_VIRTUALSHELF,
      payload: async () => {
          const response = await fetch(`${SERVER}/virtual_shelf`)
          const data = await response.json()
          return data;
      }
  }
}

export const addVirtualShelf=(virtualShelf)=> {
  return {
      type: ADD_VIRTUALSHELF,
      payload: async () => {
          let response = await fetch(`${SERVER}/virtual_shelf`, {
              method: 'post',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(virtualShelf)
          })
          response = await fetch(`${SERVER}/virtual_shelf`)
          const data = await response.json()
          return data
      }
  }
}

export const updateVirtualShelf=(virtualShelfId, virtualShelf)=> {
  return {
      type: UPDATE_VIRTUALSHELF,
      payload: async () => {
          await fetch(`${SERVER}/virtual_shelf/${virtualShelfId}`, {
              method: 'put',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(virtualShelf)
          })
          let response = await fetch(`${SERVER}/virtual_shelf`)
          let json = await response.json()
          return json
      }
  }
}

export const deleteVirtualShelf=(virtualShelfId)=> {
  return {
      type: DELETE_VIRTUALSHELF,
      payload: async () => {
          await fetch(`${SERVER}/virtual_shelf/${virtualShelfId}`, {
              method: 'delete'
          })
          let response = await fetch(`${SERVER}/virtual_shelf`)
          let json = await response.json()
          return json
      }
  }
}


export const addBook=(virtualShelfId, book)=>{
  return {
    type: ADD_BOOK,
    payload: async () => {
      let response = await fetch(`${SERVER}/virtual_shelf/${virtualShelfId}/books`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
      })
      response = await fetch(`${SERVER}/virtual_shelf/${virtualShelfId}/books`)
      const data = await response.json()
      return data
    }
  }
}

export const getBook=(virtualShelfId, bookId) => {
  return {
      type: GET_BOOK,
      payload: async () => {
          const response = await fetch(`${SERVER}/virtual_shelf/${virtualShelfId}/books/${bookId}`)
          const data = await response.json()
          return data;
      }
  }
}

export const getBooks=(virtualShelfId) => {
  return {
      type: GET_BOOKS,
      payload: async () => {
          const response = await fetch(`${SERVER}/virtual_shelf/${virtualShelfId}/books`)
          const data = await response.json()
          return data;
      }
  }
}

export const updateBook =(virtualShelfId, bookId, book)=>{
  return {
    type: UPDATE_BOOK,
    payload: async () => {
      let response = await fetch(`${SERVER}/virtual_shelf/${virtualShelfId}/books/${bookId}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
      })
      response = await fetch(`${SERVER}/virtual_shelf/${virtualShelfId}/books`)
      const data = await response.json()
      return data
    }
  }
}

export const deleteBook = (virtualShelfId, bookId) => {
  return {
    type: DELETE_BOOK,
    payload: async () => {
      let response = await fetch(`${SERVER}/virtual_shelf/${virtualShelfId}/books/${bookId}`, {
        method: 'delete'
      })
      response = await fetch(`${SERVER}/virtual_shelf/${virtualShelfId}/books`)
      const data = await response.json()
      return data
    }
  }
}