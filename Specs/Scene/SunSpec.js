/*global defineSuite*/
defineSuite([
        'Scene/Sun',
        'Core/BoundingSphere',
        'Core/Cartesian3',
        'Core/Color',
        'Core/Ellipsoid',
        'Core/Math',
        'Core/Matrix4',
        'Scene/SceneMode',
        'Specs/createScene'
    ], function(
        Sun,
        BoundingSphere,
        Cartesian3,
        Color,
        Ellipsoid,
        CesiumMath,
        Matrix4,
        SceneMode,
        createScene) {
    'use strict';

    var scene;
    var backgroundColor = [255, 0, 0, 255];

    beforeAll(function() {
        scene = createScene();
    });

    afterAll(function() {
        scene.destroyForSpecs();
    });

    beforeEach(function() {
        scene.mode = SceneMode.SCENE3D;
        scene.backgroundColor = Color.unpack(backgroundColor);
    });

    afterEach(function() {
        scene.sun = undefined;
    });

    function viewSun(camera, uniformState) {
        var sunPosition = uniformState.sunPositionWC;
        var bounds = new BoundingSphere(sunPosition, CesiumMath.SOLAR_RADIUS);
        camera.viewBoundingSphere(bounds);
    }

    it('draws in 3D', function() {
        expect(scene.renderForSpecs()).toEqual(backgroundColor);
        scene.sun = new Sun();
        scene.sun.glowFactor = 100;
        scene.render();

        viewSun(scene.camera, scene.context.uniformState);
        expect(scene.renderForSpecs()).not.toEqual(backgroundColor);
    });

    it('draws in Columbus view', function() {
        expect(scene.renderForSpecs()).toEqual(backgroundColor);
        scene.mode = SceneMode.COLUMBUS_VIEW;
        scene.sun = new Sun();
        scene.render();

        viewSun(scene.camera, scene.context.uniformState);
        expect(scene.renderForSpecs()).not.toEqual(backgroundColor);
    });

    it('does not render when show is false', function() {
        expect(scene.renderForSpecs()).toEqual(backgroundColor);
        scene.sun = new Sun();
        scene.render();
        scene.sun.show = false;

        viewSun(scene.camera, scene.context.uniformState);
        expect(scene.renderForSpecs()).toEqual(backgroundColor);
    });

    it('does not render in 2D', function() {
        expect(scene.renderForSpecs()).toEqual(backgroundColor);
        scene.mode = SceneMode.SCENE2D;
        scene.sun = new Sun();
        scene.render();

        viewSun(scene.camera, scene.context.uniformState);
        expect(scene.renderForSpecs()).toEqual(backgroundColor);
    });

    it('can set glow factor', function() {
        var sun = scene.sun = new Sun();
        sun.glowFactor = 0.0;
        expect(sun.glowFactor).toEqual(0.0);
        sun.glowFactor = 2.0;
        expect(sun.glowFactor).toEqual(2.0);
    });

    it('draws without lens flare', function() {
        expect(scene.renderForSpecs()).toEqual(backgroundColor);
        scene.sun = new Sun();
        scene.sun.glowFactor = 0.0;
        scene.renderForSpecs();

        viewSun(scene.camera, scene.context.uniformState);
        expect(scene.renderForSpecs()).not.toEqual(backgroundColor);
    });

    it('isDestroyed', function() {
        var sun = new Sun();
        expect(sun.isDestroyed()).toEqual(false);
        sun.destroy();
        expect(sun.isDestroyed()).toEqual(true);
    });
}, 'WebGL');
