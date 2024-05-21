
import sM from '../css/main_style.module.css'
import { ImageSectionButtons } from '../main/main'

import s from '../css/menu_style.module.css'
import { useEffect, useRef, forwardRef, createRef} from 'react'
import axios from 'axios'

import { apiRoute } from '../constants';
import { useState } from 'react'




export const Menu = () => {
    const [categories, setCategories] = useState([])

    const [isModalOpened, setIsModalOpened] = useState(false);

    useEffect(()=>{
        axios.get(`${apiRoute}/get-categories`).then((res)=>{
            setCategories(res.data)
        })


    },[])

    const [menu, setMenu] = useState([])
    useEffect(()=>{
        axios.get(`${apiRoute}/get-menu`).then((res)=>{
            setMenu(res.data)
        })


    },[])
  
    return <div>
        {menu.map((item)=>{
            return <MenuItemModal data={item} setModalState={setIsModalOpened}/>
        })}
        
        <div className={s['menu-category-list']}>
            {categories.map((category)=>{
                return <MenuCategory data={category} />
            })}
        </div>
        
        <div className={`${s['menu-item-list']}`}>
            {menu.map((item)=>{
                return <MenuItem data={item} modalState={isModalOpened} setModalState={setIsModalOpened} />
            })}
        </div>
    </div>
    


}

export const MenuCategory = (props) => {

    return <div className={s['menu-category-item']}>
        <img className={s['menu-category-item-img']} src={props.data.img}/>
        <p className={s['menu-category-item-name']}>{props.data.name}</p>
    </div>
    
}


export const MenuItem = (props) => {
    const readMoreOnClick = (e) => {
        const modalID = `modal${e.currentTarget.id}`;
        if (!props.modalState){
            document.getElementById(modalID).style.display = 'block';
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = "15px";
            props.setModalState(true);
        }
    }

    return <div className={s['menu-item-list-item']} >
        <img className={s['menu-item-list-item-img']}src={props.data.img}/>
        <div className={`${s['menu-item-list-item-content']}`}>
            <h5 className={s['menu-item-list-item-name']} style={{paddingBottom:'0'}}>{props.data.name}</h5>
            <h5 className={s['menu-item-list-item-price']}>{props.data.price}$</h5>
        </div>
        <span className={s['menu-item-list-read-more']} onClick={readMoreOnClick} id={props.data.id}>
            Read More<i className={`bi bi-caret-right-fill ${s['read-more-arrow']}`}></i>
        </span>
    </div>


}


export const MenuItemModal = (props)=>{
    const closeModalOnClick = (e) => {
            const modalID = `modal${e.target.id}`
            const elem = document.getElementById(modalID);
            elem.style.display = 'none';
            document.body.style.overflow ='visible';
            document.body.style.paddingRight = "0px";
            props.setModalState(false);
    }


    return <div className={s['modal']} id={`modal${props.data.id}`}>
        <i onClick={closeModalOnClick} class="bi bi-x-lg" 
        style={{position:"absolute", fontSize:"20px", color:"white", padding:2}}
        id={props.data.id}></i>
        <img src={props.data.big_img} width="100%" height={320} style={{objectFit:"cover", borderRadius:8}}/>
        <div style={{justifyContent:"center", textAlign:"center", boxShadow:"0 6px 5px 0 rgba(204,204,204,.24)", padding:"10px 0px"}}>
            <h5 className={s['menu-item-list-item-name']} style={{paddingBottom:'0'}}>{props.data.name}</h5>
            <h5 className={s['menu-item-list-item-price']}>{props.data.price}$</h5>
        </div>
        <div style={{justifyContent:"center", textAlign:"center", padding:"20px 50px"}}>
            <p>{props.data.desc}</p>
        </div>
    </div>
}
    
export const MenuImageSectionContent = () => {
    return <div className={sM.sectioncontent}>
        <h3>Menu</h3>

        <ImageSectionButtons/>
    </div>
}   