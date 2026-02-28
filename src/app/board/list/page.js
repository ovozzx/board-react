// SSR (서버 컴포넌트) - 초기 목록 데이터를 서버에서 가져옴
import { API_BASE_URL } from "@/api/apiUrl";
import BoardList from "@/components/board/BoardList";

export default async function BoardListPage() {
    // 서버에서 초기 데이터 fetch (1페이지, 검색 조건 없음)
    const res = await fetch(`${API_BASE_URL}/board/list?page=1`, {
        cache: 'no-store' // 항상 최신 데이터
    });

    if (!res.ok) {
        return <div className="max-w-5xl mx-auto px-4 py-10 text-red-500">목록을 불러올 수 없습니다. (status: {res.status})</div>;
    }

    const data = await res.json();

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                게시글 목록
            </h1>

            {/* 검색 + 테이블 + 페이징 (클라이언트 컴포넌트) */}
            <BoardList initialData={data} />
        </div>
    );
}
