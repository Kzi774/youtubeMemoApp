import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import './App.css'

type Memo ={
  videoUrl: string,
  thumbnailUrl: string,
  id: number,
  memo: string,
}

function App() {

  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=1ynJsSsPY3U");
  const [thumbnailUrl, setThumbnailUrl] = useState("https://img.youtube.com/vi/1ynJsSsPY3U/maxresdefault.jpg");
  const [memo, setMemo] = useState("");
  const [memos, setMemos] = useState<Memo[]>([]);



  useEffect(() => {
    const storedMemos = localStorage.getItem('memos');
    if (storedMemos) {
      try {
        const parsedMemos = JSON.parse(storedMemos);
        if (Array.isArray(parsedMemos)) {
          setMemos(parsedMemos);
        } else {
          console.error('Stored memos is not an array');
          localStorage.removeItem('memos');
        }
      } catch (error) {
        console.error('Error parsing stored memos', error);
        localStorage.removeItem('memos');
      }
    }
  }, []);

  useEffect(() => {
    if (memos.length > 0) {
    localStorage.setItem('memos', JSON.stringify(memos));
    }
  }, [memos]);

  const onChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    const videoId = getSubstringAfter(e.target.value, "=");
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    setThumbnailUrl(thumbnailUrl);
  }

  const getSubstringAfter = (input: string, delimiter: string): string =>{
    const index = input.indexOf(delimiter);
    if (index === -1) {
        return ""; // デリミタが見つからなかった場合、空文字を返す
    }
    return input.slice(index + delimiter.length); // デリミタの次の位置から文字列を切り取る
  }

  const changeMemo = (e: ChangeEvent<HTMLInputElement>) => {
    setMemo(e.target.value);
  }

  const registerPush = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newmemos: Memo = {
      videoUrl: videoUrl,
      thumbnailUrl: thumbnailUrl,
      id: memos.length,
      memo: memo,
    }

    setMemos(prevMemos => [newmemos, ...prevMemos]);
    setVideoUrl("");
    setMemo("");
  }

  const handleDelete = (id: number) => {
    const newmemos = memos.filter((memo) => memo.id !== id);
    setMemos(newmemos)
  }

  return (
    <>
      <div className='contentWraper'>
        <h1>youtubeメモアプリ</h1>
        <form id='searchForm'>
          <label htmlFor="">youtube動画のURLを入力</label>
          <input type="text" id='url' onChange={(e) => onChangeUrl(e)} />
        </form>
        <img src={thumbnailUrl}alt="" />
        <form onSubmit={(e) => registerPush(e)} id='registerForm'>
          <p>memo</p>
          <textarea onChange={(e) => changeMemo(e)} id='memo' value={memo}/>
          <button type='submit'>登録する</button>
        </form>
      </div>
      <h2>記入したメモ</h2>
      <ul className='writtenMemo'>
        {memos.map((memo) => (
          <li key={memo.id}>
            <a href={memo.videoUrl}><img src={memo.thumbnailUrl} alt="" /></a>
            <div>
              <p>{memo.memo}</p>
              <button onClick={(e) => handleDelete(memo.id)}>削除</button>
            </div>
            
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
