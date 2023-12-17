import React from 'react';

import Button from '../atom/button/Button';

const Header = () => {
  const styles = 'hover:text-[#2D36CE] border-b-[#2D36CE] font-bold';

  return (
    <header>
      <div className='w-screen bg-white border-b flex justify-between h-12'>
        <div className='w-3/5 flex justify-between mx-auto'>
          <Button label='Resume' className={` ${styles}`} renderHoverContent />
          <Button
            label='Portfolio'
            className={` ${styles}`}
            renderHoverContent
          />
          <Button label='Github' className={` ${styles}`} renderHoverContent />
          <Button label='Blog' className={` ${styles}`} renderHoverContent />
        </div>
      </div>
    </header>
  );
};

export default Header;