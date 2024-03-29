import './App.css';
import { Component } from 'react';

import picservice from './services/picservice';
import Auth from './services/auth';
import Factory from './models/myComponents';
import Opps from './models/operationsFactory';
import Dispatch from './dispatch';
import ComponentListInterface from './componentListNPM/componentListInterface';
import auth from './services/auth';
import Feed from './view/feed';
import Logo from './pics/Golficon.png'
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";

import styleService from './services/styleService';
import MyContent from './view/myContent';
import Keep from './view/keep';
import SpawnPic from './pics/golfClub.jpg';
import KeepIcon from './pics/golfClub.jpg';
import PictureUploader from './pictureUploader';
//fonts


//model
export default class App extends Component {


  constructor(props){
    super(props);
        this.handleChange=this.handleChange.bind(this);
        this.dispatch=this.dispatch.bind(this);

    this.state={
      styles: styleService.getstyles(),
      loginPage: false,
      registerPage:false,
      user: undefined,
      componentListInterface: new ComponentListInterface(this.dispatch),
      componentList: undefined,
      pic: null,
      switchcase: "spawn",
      recentpics : [],
      login : false,
      newSpawn: false,
      hash:{},
      listItems:[],
      switchCase:[
        {path:"/", comp: MyContent, name: "My Content", icon:SpawnPic, switchcase:"spawn",},
        {path:"/keep", comp:Keep, name: "My Bag", switchcase:"keep", icon:KeepIcon},
        {path:"/clubs", comp:Feed, name:"Clubs", feed:true, switchcase:"clubs"},
        {path:"/events", comp:Feed, name:"Events", feed:true, switchcase:"events"},
        {path:"/courses", comp:Feed, name:"Courses", feed:true, switchcase:"courses"},
        {path:"/meetups", comp:Feed, name:"Meetups", feed:true, switchcase:"meetups"},
        {path:"/all", comp:Feed, name:"All", feed:true, switchcase:"all"},
        
      ] ,
      i: 2,
      operate: undefined,
      operation: "cleanJsonPrepare",
      object: undefined,
      currentComponent: undefined,
      backend: false,
      backendUpdate: undefined,
      picChange:false,
      backendUpdate:[],
      backend: false,
      myswitch: "spawn",
      index: 0,
      picOwner:undefined
    }
  }


  async componentDidUpdate(props, state){
    if(this.state.backend){
      await this.setState({backend: false});
      auth.dispatch(this.state.backendUpdate, this.state.email);
    }

    //temporary fix 
    if(this.state.popupSwitch ==="block" || this.state.popupSwitch ==="hide", this.state.popupSwitch ==="report"){
      let theSwitch = this.state.popupSwitch;
      debugger
      await this.setState({
        popupSwitch:""
      });
      let list = this.state.componentList.getList(this.state.switchcase)
            let i = this.state.index;
            if (i - 1 <= 0 ) {
              i = 0
            }
            else {
              i = i - 1
            }


            this.setState({ pic: list[i], index: i, picChange: true })
    }
    if(this.state.picChange){
      await this.setState({ picChange:false, })
      debugger
      await auth.getComments(this.state.componentList, this.state.pic.getJson()._id);
      let picOwner= await auth.getPicOwner(this.state.componentList, this.state.pic.getJson().owner);
      this.setState({picOwner: picOwner})
      await this.setState({operate:"update", operation:"cleanPrepare", object: this.state.pic })
    }
    if(this.state.operate!==undefined){
      let operate = this.state.operate;
      let operation= this.state.operation;
      let object= this.state.object;
      await this.setState({operate:undefined, object:undefined, operation:"cleanJsonPrepare"});

      
      let currentComponent = await this.state.componentListInterface.getOperationsFactory().operationsFactoryListener({operate: operate, object:object, operation: operation});
      
      console.log(currentComponent);
      let key = await this.state.componentListInterface.getOperationsFactory().getSplice(operate);
      if(currentComponent!==undefined){
        
        this.setState({currentComponent: currentComponent[key][0]});
        if(this.state.myswitch==="upload"){
          this.setState({newSpawn:true})
        }
      }
    }

    
    
    

  }

  async dispatch(obj){

    await this.setState(obj)
}

handleChange = (event) => {
    const { name, value } = event.target
    this.setState({
        [name]: value,
    })
}

  async componentDidMount(){
    let list;
    if(this.state.componentListInterface && this.state.componentList===undefined){
        list= await this.state.componentListInterface.createComponentList();
        await this.setState({
          componentList:list
        })

    }
    debugger
    await auth.getPics(list);
    let listItems = this.state.switchCase.filter(obj=> obj.feed===true).map((obj, index)=>obj.switchcase);
    
    let comp = list.getComponent(listItems[0],)
    await this.setState({pic: comp, currentComponent: comp, listItems:listItems});
    list.getOperationsFactory().cleanPrepare({update:comp});
    
    let user = await auth.getCurrentUser();
    if(user){
      user = JSON.parse(user);
      let email = user.email
      await auth.getuser(user.email, list);
      user = list.getComponent('user')
      auth.getComments(this.state.componentList, comp.getJson()._id);
      this.setState({
        user: user,
        login: true,
        register:false,
        email:email
      })
    }
    

    const FontFace = () => {
      return(
          <div className="card">
              <span className="font-face"></span>
          </div>
      )
    };
    
    
  }

  //ENTIRE view
  render(){
    let styles = this.state.styles;

    
  return (
<BrowserRouter>
    <div className= "fontNormal" style={{
      width:"100vw", 
      height:"100vh", 
      display:"flex", 
      overflow:"hidden",
      zIndex:"100",
      fontFamily: styles.fonts.appFont, 
      background: styles.colors.White1,
       
      flexDirection:"column"}}>
        

      <div style={{
        
        width: "100vw",
        height: styles.logoTop.stripHeight, 
        background: styles?.colors.color2,
        filter:"drop-shadow(0px 0px 4px "+styles.colors.color1+")",
        zIndex: "80"
        }}>
          <Link to = "/">
      <img onClick={()=>{
       if (this.state.login){
        this.setState({
        myswitch:"feed"
       })
       }
      }
      } style={{
        height: styles.logoTop.imgHeight,
        width: styles.logoTop.imgWidth,
        marginLeft: styles.logoTop.marginLeft,
        marginBottom: styles.logoTop.marginBottom,
        marginTop: styles.logoTop.marginTop,

        
        }} src={Logo}/></Link></div>
        
        {/* <PictureUploader
  formStyle={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#36393f',
    borderRadius: '8px',
  }}
  labelStyle={{
    fontSize: '16px',
    color: '#b9bbbe',
    marginBottom: '12px',
    textAlign: 'center',
  }}
  containerStyle={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  }}
  imageContainerStyle={{
    width: '256px',
    height: '256px',
    backgroundColor: '#2f3136',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
  imageStyle={{
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '8px',
  }}
  buttonStyle={{
    backgroundColor: '#7289da',
    color: '#fff',
    border: 'none',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  }}
/> */}

      <Dispatch app={{state:this.state, handlechange:this.handleChange, dispatch:this.dispatch, factory:this.factory}} />
      

      
    </div></BrowserRouter>
  )}
}
