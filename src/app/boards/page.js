// Server-Side Rendering (서버 컴포넌트) - 초기 목록 데이터를 서버에서 가져옴
import {API_BASE_URL, getBoards} from "@/api/apiUrl";
import BoardList from "@/components/board/BoardList";


export default async function BoardListPage() {

    // 서버에서 초기 데이터 fetch (1페이지, 검색 조건 없음)
    // 서버 컴포넌트의 fetch는 기본적으로 캐시됨
    let data; //  const는 선언 시점에 무조건 값을 줘야 함. let은 블록 스코프
    try {
        data = await getBoards("");
    } catch (err) {
        return <div className="max-w-5xl mx-auto px-4 py-10 text-red-500">목록을 불러올 수 없습니다. ({err.message})</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                게시글 목록
            </h1>

            {/* 사용자 이벤트 처리 : 검색 + 테이블 + 페이징 ("클라이언트" 컴포넌트), 초기 데이터만 넘겨줌 */}
            <BoardList initialData={data} />
        </div>
    );


}
