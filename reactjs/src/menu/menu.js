
import sM from '../css/main_style.module.css'
import { ImageSectionButtons } from '../main/main'

import s from '../css/menu_style.module.css'
import { useEffect, useRef, forwardRef, createRef} from 'react'
import axios from 'axios'

import { apiRoute } from '../constants';
import { useState } from 'react'




export const Menu = () => {



    const [categories, setCategories] = useState([])
    const activeCategory = useRef();

    useEffect(()=>{
        axios.get(`${apiRoute}/get-categories`).then((res)=>{
            setCategories(res.data)
        })


    },[])

    const [menu, setMenu] = useState([])
    const [constantMenu, setConstantMenu] = useState([])

    //[1,2,3] => [[1,2], [3]]
    const getRows = (data) => {
        return data.reduce(function (rows, key, index) { 
        return (index % 2 == 0 ? rows.push([key]) 
          : rows[rows.length-1].push(key)) && rows;
      }, []); 
    }

    const resetMenu = () =>{
        setMenu(constantMenu)
    }

    useEffect(()=>{
        axios.get(`${apiRoute}/get-menu`).then((res)=>{
            setMenu(res.data)
            setConstantMenu(res.data)
        })


    },[])
    
  
    const modalRef = createRef();   
    const [modalInfo, setModalInfo] = useState({})
    const [isModalOpened, setIsModalOpened] = useState(false);

    return <div className='container'>
        <div>
            <MenuItemModal setModalState={setIsModalOpened} data={modalInfo} ref={modalRef}/>
        </div>

        <div className={s['menu']}>

            <div className={s['menu-category-list']}>
                {categories.map((category)=>{
                    return <MenuCategory data={category} 
                                        activeCategory={activeCategory} 
                                        setMenu={setMenu} 
                                        resetMenu={resetMenu}/>
                })}
            </div>


            <div className={`${s['menu-item-list']} mb-4`}>    
                            {getRows(menu).map((row)=>(
                                    <div className='row row-cols-lg-2 row-cols-md-2 row-cols-sm-1 row-cols-xs-1'>
                                        {row.map(col=> (
                                            <div className='col-lg-6 gy-4 d-flex justify-content-center' >
                                                <MenuItem data={col} 
                                                    modalState={isModalOpened} 
                                                    setModalState={setIsModalOpened} 
                                                    setModalInfo={setModalInfo}
                                                    modalRef={modalRef}
                                                    />
                                            </div>
                                            )
                                        )
                                        }
                                    
                                    </div>
                            ))}
            </div> 
        </div>
            
        
       
    </div>

}

export const MenuCategory = (props) => {
    const ref = props.activeCategory;
    const categoryOnClick = (e) => {

        //reseting previous
        if (ref.current)
            ref.current.className = s['menu-category-item'];
        
        //if clicked on already applied filter
        if (e.currentTarget == ref.current){
            props.resetMenu()
            ref.current = null
        }
        else{
            e.currentTarget.className = `${s['menu-category-item']} ${s['menu-category-item-active']}`;
            ref.current = e.currentTarget;
            props.setMenu(props.data.menu_items)
        }
    } 

    return <div className={s['menu-category-item']} id={`${props.data.name}`} onClick={categoryOnClick}>
            <figure><img className={s['menu-category-item-img']} src={props.data.img}/></figure>

            <figcaption className={s['menu-category-item-name']} >{props.data.name}</figcaption>
            
        </div>
    
}


export const MenuItem = (props) => {

    const readMoreOnClick = (e) => {
        if (!props.modalState){
            props.modalRef.current.style.display = 'block';
            props.setModalInfo(props.data)
            props.setModalState(true);
        }
    }

    return <div className={s['menu-item-list-item']} >
        <img className={s['menu-item-list-item-img']}src={props.data.img}/>
        <div className={`${s['menu-item-list-item-content']}`}>
            <h5 className={s['menu-item-list-item-name']}>{props.data.name}</h5>
            <h5 className={s['menu-item-list-item-price']}>{props.data.price}$</h5>
        </div>
        <span className={s['menu-item-list-read-more']} onClick={readMoreOnClick} id={props.data.id}>
            Read More<i className={`bi bi-caret-right-fill ${s['read-more-arrow']}`}></i>
        </span>
    </div>


}





export const MenuItemModal = forwardRef((props, ref) => {
    const closeModalOnClick = () => {
        ref.current.style.display = 'none'
        props.setModalState(false);
    }




    useEffect(()=>{
    
    }, [props.data])



    useEffect(() => {
        // When modal opens, prevent body scroll
        if (props.modalState) {
            document.body.style.overflow = 'hidden';
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`; // Add padding to prevent layout shift
        } else {
            // When modal closes, reset body styles
            document.body.style.overflow = 'visible';
            document.body.style.paddingRight = "0px";
        }

        return () => {
            // Clean up when component unmounts or modal closes
            document.body.style.overflow = 'visible';
            document.body.style.paddingRight = "0px";
        };
    }, [props.modalState]);  // Run effect only when modalState changes

    return <div className={s['modal']} ref={ref}>
        <i onClick={closeModalOnClick} className={`${s['modal-close-icon']} bi bi-x-lg`} 
                                       id={props.data.id}></i>
        <img src={props.data.big_img} className={s['modal-img']}/>
        <div className={s['modal-item-content']}>
            <h5 className={s['menu-item-list-item-name']}>{props.data.name}</h5>
            <h5 className={s['menu-item-list-item-price']}>{props.data.price}$</h5>
        </div>
        <div className={s['modal-item-description']}>
            <p>{props.data.desc}</p>
        </div>
    </div>
});
    
export const MenuImageSectionContent = () => {
    return <div className={sM.sectioncontent}>
        <h3>MENU</h3>

        <ImageSectionButtons/>
    </div>
}   