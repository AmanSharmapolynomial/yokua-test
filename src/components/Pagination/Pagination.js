import React from 'react'

const Pagination = ({ noOfPages, currentPage }) => {
  const pages = []
  for (var i = 1; i <= noOfPages; i++) {
    pages.push({
      pageNo: i,
    })
  }

  return (
    <div className="pagination-container">
      <div className="page-box">
        {pages.map((page, index) => (
          <button>Page {page.pageNo}</button>
        ))}
        <button>Next Page</button>
      </div>
    </div>
  )
}

export default Pagination
