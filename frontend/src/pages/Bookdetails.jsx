import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchBook } from '../services/api'

export default function BookDetails() {
  const { id } = useParams()
  const [book, setBook] = useState(null)

  useEffect(() => {
    fetchBook(id).then(setBook)
  }, [id])

  if (!book) return <p>Loading...</p>

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-semibold">{book.title}</h2>
      <p className="text-gray-700 mt-2">Author: {book.author}</p>
      <p className="mt-3 text-sm">{book.description || 'No description available.'}</p>
    </div>
  )
}
