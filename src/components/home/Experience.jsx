const Lessons = () => {
  return (
    <main className="experiences 
    animate__animated 
    animate__fadeInDown 
    animate__faster">
      <header>My experience</header>
      <div className="experience-wrapper">
        <a href="https://www.plavalaguna.com/">
          <div className="experience currently-working">
            <h4 className="currently-working-h4">Currently working at:</h4>
            <div className="working-wrapper">
              <img src="https://www.plavalaguna.com/images/pl-logo.svg" alt="PL" />
              <div className="description-wrapper">
                <h4>Plava laguna</h4>
                <h5>Šef restorana</h5>
                <p>x months</p>
              </div>
            </div>
          </div>
        </a>
        <a href="https://www.plavalaguna.com/">
          <div className="experience">
            <img src="https://www.plavalaguna.com/images/pl-logo.svg" alt="PL" />
            <div className="description-wrapper">
              <h4>Plava Laguna</h4>
              <h5>Kuhar</h5>
              <p>12 months</p>
            </div>
          </div>
        </a>
        <a href="https://www.dubrovniksungardens.com/?gclid=Cj0KCQiApKagBhC1ARIsAFc7Mc5tqmluPgb52K7Sk7VTgGYQq1FoQmTXWi5YZAYybvTTzivlFmtXi1gaAqJhEALw_wcB&gclsrc=aw.ds">
          <div className="experience">
            <img src="data:image/png;base64,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" alt="SGD" />
            <div className="description-wrapper">
              <h4>Sun Gardens Dubrovnik</h4>
              <h5>Samostalni kuhar na odjelu pizza</h5>
              <p>3 months</p>
            </div>
          </div>
        </a>
      </div>
    </main>
  );
}
 
export default Lessons;