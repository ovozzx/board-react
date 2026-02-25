'use client';

import { useState, useEffect } from 'react';

export default function BoardListPage() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState({
    ple.log('API 호출:', url);

      fetch(url)
      .then(res => {
          console.log('응답 상태:', res.status);
          if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
      })
          .then(data => {
              console.log('받은 데이터:', data);
              setData(data);
          })
          .catch(err => {
              console.error('API 에러:', err);
              alert('API 호출 실패: ' + err.message + '\n\n백엔드 서버(http://localhost:8081)가 실행 중인지 확인하세요.');
          });
  }, [search]);

    if (!data) return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>Loading...</h2>
            <p>API 서버에 연결 중입니다.</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
                F12를 눌러 콘솔을 확인하세요.
            </p>
        </div>
    );

    return (
        <div className="container">
            <h1>게시판</h1>

            {/* 검색 */}
            <div className="search-box">
                <select
                    value={search.categoryId}
                    onChange={e => setSearch({...search, categoryId: e.target.value, page: 1})}
                >
                    <option value="0">전체</option>
                    {data.categoryList?.map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                            {cat.categoryName}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="검색"
                    value={search.keyword}
                    onChange={e => setSearch({...search, keyword: e.target.value})}
                    onKeyPress={e => e.key === 'Enter' && setSearch({...search, page: 1})}
                />
            </div>

            {/* 목록 */}
            <table>
                <thead>
                <tr>
                    <th>번호</th>
                    <th>카테고리</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회</th>
                    <th>날짜</th>
                </tr>
                </thead>
                <tbody>
                {data.boardList?.map((board, i) => (
                    <tr key={board.boardId}>
                        {/*<td>{data.pageInfo.totalCount - (search.page - 1) * 10 - i}</td>*/}
                        <td>{board.categoryName}</td>
                        <td>
                            <a href={`/board/${board.boardId}`}>{board.title}</a>
                        </td>
                        <td>{board.createUser}</td>
                        <td>{board.viewCount}</td>
                        <td>{board.createDate?.slice(0, 10)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* 페이징 */}
            {/*<div className="pagination">*/}
            {/*  {data.pageInfo.startPage > 1 && (*/}
            {/*      <button onClick={() => setSearch({...search, page: data.pageInfo.startPage - 1})}>*/}
            {/*        ◀*/}
            {/*      </button>*/}
            {/*  )}*/}

            {/*  {[...Array(data.pageInfo.endPage - data.pageInfo.startPage + 1)].map((_, i) => {*/}
            {/*    const pageNum = data.pageInfo.startPage + i;*/}
            {/*    return (*/}
            {/*        <button*/}
            {/*            key={pageNum}*/}
            {/*            onClick={() => setSearch({...search, page: pageNum})}*/}
            {/*            className={pageNum === search.page ? 'active' : ''}*/}
            {/*        >*/}
            {/*          {pageNum}*/}
            {/*        </button>*/}
            {/*    );*/}
            {/*  })}*/}

            {/*  {data.pageInfo.endPage < data.pageInfo.totalPages && (*/}
            {/*      <button onClick={() => setSearch({...search, page: data.pageInfo.endPage + 1})}>*/}
            {/*        ▶*/}
            {/*      </button>*/}
            {/*  )}*/}
            {/*</div>*/}

            <style jsx>{`
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          .search-box {
            margin: 20px 0;
            display: flex;
            gap: 10px;
          }
          .search-box select,
          .search-box input {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .search-box input {
            flex: 1;
            max-width: 300px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid #ddd;
          }
          th {
            background: #f5f5f5;
            font-weight: 600;
          }
          td:nth-child(3) {
            text-align: left;
          }
          a {
            color: #333;
            text-decoration: none;
          }
          a:hover {
            color: #007bff;
            text-decoration: underline;
          }
          .pagination {
            display: flex;
            justify-content: center;
            gap: 5px;
            margin: 20px 0;
          }
          .pagination button {
            padding: 6px 12px;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
            border-radius: 4px;
          }
          .pagination button:hover {
            background: #f5f5f5;
          }
          .pagination button.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }
        `}</style>
        </div>
    );
}age: 1,
    keyword: '',
    categoryId: '0'
  });

  useEffect(() => {
    const params = new URLSearchParams({
      page: search.page.toString(),
      keyword: search.keyword || '',
      categoryId: search.categoryId || '0'
    });

    const url = `http://localhost:8081/api/list?${params}`;
    conso
