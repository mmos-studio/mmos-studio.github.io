import * as THREE from './Threejs/three.module.js';
import { OrbitControls } from './Threejs/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './Threejs/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from './Threejs/jsm/loaders/RGBELoader.js';
import {RoughnessMipmapper} from './Threejs/jsm/utils/RoughnessMipmapper.js';

var container, controls;
var camera, scene, renderer;

init();
render();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.set(-2, 0.6, 1.7);

    scene = new THREE.scene();

    new RGBELoader()

     .setDataType(THREE.UnsignedByteType)
     .setPath('./models/textures/')
     .load( 'royal_esplanade_1k.hdr', function ( texture ) {

        var envMap = pmremGenerator.fromEquirectangular(texture).texture;

        scene.background = envMap;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

        render();

        var roughnessMipmapper = new RoughnessMipmapper(renderer);

        var loader = new GLTFLoader().setPath('./models/');
        loader.load('mmos_textCube.gltf', function (gltf){
            gltf.scene.traverse(function(child){
                if (child.isMesh){
                    roughnessMipmapper.generateMipmaps(child.material);
                }
            });
            scene.add(gltf.scene);
            roughnessMipmapper.dispose();
            render();
        });
    });
        
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
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

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			//

			function render() {

				renderer.render( scene, camera );

            }
        
    
        
    


