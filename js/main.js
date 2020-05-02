import * as THREE from './build/three.module.js';
        
import { OrbitControls } from './Threejs/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './Threejs/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from './Threejs/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from './Threejs/jsm/utils/RoughnessMipmapper.js';

var threeCont, controls,logoSlide;
var camera, scene, renderer;


 init();
 render();

 function init() {
    var title = document.createElement('div');
    title.setAttribute("id","title");
    document.getElementById('container').appendChild(title);
    title.innerHTML = "MMOS";
    
    threeCont = document.createElement( 'div' );
     document.getElementById('container').appendChild( threeCont );
     threeCont.classList.add('threeCont');
     threeCont.setAttribute("id","container-canvas");

    var logoSlide = document.createElement('div');
    logoSlide.classList.add('logoSlide');
    document.getElementById('container').appendChild(logoSlide);

    var aboutLink = document.createElement('a');
    var workLink = document.createElement('a');
    var contactLink = document.createElement('a');

    aboutLink.classList.add('aboutLink');
    workLink.classList.add('workLink');
    contactLink.classList.add('contactLink');

    document.getElementById('aboutLink').appendChild(aboutLink);
    aboutLink.innerHTML = "ABOUT";
    document.getElementById('workLink').appendChild(workLink);
    workLink.innerHTML = "WORK";
    document.getElementById('contactLink').appendChild(contactLink);
    contactLink.innerHTML = "CONTACT";

    
    var tl = anime.timeline({
        easing: 'easeOutExpo',
        duration:1800
        
    });
    tl 
    .add({

        targets: '.logoSlide',
        opacity: ['1','0'],

    },'+=800')
    .add({

        targets: '#title',
        opacity: ['0','1'],

    })
    .add({
        targets: '.logoSlide',
        translateX:3000,
        
    },'-=400', console.log('LOGO SLIDE TO LEFT x 3000'))
   
   
    

    var container = document.getElementById('container-canvas');
    var h = container.offsetHeight;
    var w = container.offsetWidth;

    camera = new THREE.PerspectiveCamera( 45,  w / h, 0.25, 20 );
    camera.position.set( - 8, 0.6, 2.7 );

    scene = new THREE.Scene();

    new RGBELoader()
        .setDataType( THREE.UnsignedByteType )
        .setPath( './models/Textures/' )
        .load( 'Energy_env.hdr', function ( texture ) {

            var envMap = pmremGenerator.fromEquirectangular( texture ).texture;

            scene.background = envMap;
            scene.environment = envMap;

            texture.dispose();
            pmremGenerator.dispose();

            render();

            // model

            // use of RoughnessMipmapper is optional
            var roughnessMipmapper = new RoughnessMipmapper( renderer );

            var loader = new GLTFLoader().setPath( './models/' );
            loader.load( 'EnergyDrink_mmos_V3.gltf', function ( gltf ) {

                gltf.scene.traverse( function ( child ) {

                    if ( child.isMesh ) {

                        roughnessMipmapper.generateMipmaps( child.material );

                    }

                } );

                scene.add( gltf.scene );

                roughnessMipmapper.dispose();

                render();

            } );

        } );
   
    renderer = new THREE.WebGLRenderer( { antialias: true } );
   
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(w, h );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    var pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10
    controls.target.set( 0, 0, - 0.2 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize, false );

 }

function onWindowResize() {

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h );

    render();

}



 function render() {

     renderer.render( scene, camera );

 }


        
    


