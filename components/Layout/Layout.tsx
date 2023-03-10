import Link from 'next/link'

export const Layout = ({ children }: any) => {
  return (
    <>
      <header>
        <Link href={"/"}>Home</Link>
        <Link href={"/editor"}>Editor</Link>
        <Link href={"/contact"}>Contact</Link>
      </header>
      <main>
        {children}
      </main>
      <style jsx>
        {`
          body {
            height: 100%;
          }
          
          header {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            height: 100px;

            display: flex;
            justify-content: space-around;
            align-items: center;

            background-image: -o-linear-gradient(bottom, rgba(0,0,0,0.1) 24%, rgb(50,50,150) 62%);
            background-image: -moz-linear-gradient(bottom, rgba(0,0,0,0.1) 24%, rgb(50,50,150) 62%);
            background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0.24, rgba(0,0,0,0.1)), color-stop(0.62, rgb(50,50,150)));
            background-image: -webkit-linear-gradient(bottom,rgba(0,0,0,0.1) 24%, rgb(50,50,150) 62%);
            background-image: -ms-linear-gradient(bottom, rgba(0,0,0,0.1) 24%, rgb(50,50,150) 62%);
            background-image: linear-gradient(bottom, rgba(0,0,0,0.1) 24%, rgb(50,50,150) 62%);
            z-index: 3;
          }
          main {
            margin-top: 100px;

            padding: 50px;
          }
      `}
      </style>
    </>
  )
}