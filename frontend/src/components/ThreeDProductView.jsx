import React, { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";
import { GLTFFileLoader } from "@babylonjs/loaders/glTF/index";

BABYLON.SceneLoader.RegisterPlugin(new GLTFFileLoader());

const ThreeDProductView = ({ product }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!product?.modelUrls?.length) return;

    const modelUrl = `http://localhost:5000${product.modelUrls}`


    // const lastSlashIndex = modelUrl.lastIndexOf("/") + 1;
    // const rootUrl = modelUrl.substring(0, lastSlashIndex);
    // const sceneFilename = modelUrl.substring(lastSlashIndex);

    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2.5,
      5,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.minZ = 0.1;
    camera.maxZ = 10000;

    // Lights
    new BABYLON.DirectionalLight(
      "warmLight",
      new BABYLON.Vector3(-1, -0.5, -1),
      scene
    ).intensity = 1.5;

    new BABYLON.DirectionalLight(
      "coolLight",
      new BABYLON.Vector3(1, -0.2, 1),
      scene
    ).intensity = 0.8;

    new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 1, 0), scene)
      .intensity = 0.3;

    let isMounted = true;

    // Load model


// Ensure all meshes after load have proper PBR handling
BABYLON.SceneLoader.ImportMeshAsync(null, '', modelUrl, scene)
  .then((result) => {
    if (result.meshes.length) {
      camera.target = result.meshes[0].getBoundingInfo().boundingBox.centerWorld;
      const boundingInfo = result.meshes[0].getHierarchyBoundingVectors();
      const size = boundingInfo.max.subtract(boundingInfo.min);
      const maxDimension = Math.max(size.x, size.y, size.z);
      const desiredSize = 1.5; // how big in view
      const scaleFactor = desiredSize / maxDimension;
      result.meshes[0].scaling.scaleInPlace(scaleFactor);

    }

    result.meshes.forEach(mesh => {
      if (mesh.material && mesh.material.isPBRMaterial) {
        mesh.material.backFaceCulling = false; // if model has double-sided surfaces
        mesh.material.environmentIntensity = 1.0;
      }
    });
  })
  .catch((err) => console.error("Failed to load model:", err));

    // Auto-rotation
    scene.registerBeforeRender(() => {
      camera.alpha += 0.002;
    });

    // Render loop
    engine.runRenderLoop(() => {
      if (isMounted) scene.render();
    });

    // Resize
    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [product?.modelUrls]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ThreeDProductView;
