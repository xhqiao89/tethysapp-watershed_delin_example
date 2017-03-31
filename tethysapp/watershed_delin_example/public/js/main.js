var app,jobInfo2;

require(["esri/Color",
              "esri/layers/ArcGISDynamicMapServiceLayer",
              "esri/layers/ArcGISTiledMapServiceLayer",
              "esri/map",
              "esri/graphic",
              "esri/graphicsUtils",
              "esri/tasks/Geoprocessor",
              "esri/tasks/FeatureSet",
              "esri/tasks/LinearUnit",
              "esri/symbols/SimpleMarkerSymbol",
              "esri/symbols/SimpleLineSymbol",
              "esri/symbols/SimpleFillSymbol"
              ],
        function(Color, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, Map, Graphic, graphicsUtils, Geoprocessor, FeatureSet, LinearUnit, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol){

            var map, gp;
            var featureSet = new FeatureSet();

            map = new Map("mapDiv", {
              basemap: "streets",
              center: [110.5, 31.7],
              zoom: 12
            });

            var borderLayer = new ArcGISDynamicMapServiceLayer("http://geoserver.byu.edu:6080/arcgis/rest/services/dan_ames/watershedborder/MapServer");
            map.addLayer(borderLayer);

            gp = new Geoprocessor("http://geoserver.byu.edu:6080/arcgis/rest/services/dan_ames/watershed_delineation2/GPServer/WatershedDelineation");
            gp.setOutputSpatialReference({
              wkid: 102100
            });
            map.on("click", addPoint);

          function addPoint(evt) {
            map.graphics.clear();
            var pointSymbol = new SimpleMarkerSymbol();
            pointSymbol.setSize(14);
            pointSymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1));
            pointSymbol.setColor(new Color([0, 255, 0, 0.25]));

            var graphic = new Graphic(evt.mapPoint, pointSymbol);
            map.graphics.add(graphic);

            var features = [];
            features.push(graphic);
            featureSet.features = features;
          }

          function run_service(){
            var params = {
              "Point": featureSet
             };
            gp.submitJob(params, completeCallback, statusCallback);
          }

          function statusCallback(jobInfo) {
            console.log(jobInfo.jobStatus);
            if (jobInfo.jobStatus === "esriJobSubmitted") {
              $("#volstatus").html("<h7 style='color:blue'><b>Job submitted...</b></h7>");
            } else if (jobInfo.jobStatus === "esriJobExecuting") {
                $("#volstatus").html("<h7 style='color:red;'><b>Calculating...</b></h7>");
            } else if (jobInfo.jobStatus === "esriJobSucceeded") {
                $("#volstatus").html("<h7 style='color:green;'><b>Succeed!</b></h7>");
            }
          }

          function completeCallback(jobInfo) {
            console.log("getting data");
            jobInfo2= jobInfo;
            gp.getResultData(jobInfo.jobId, "watershed_poly", displayWatershed);
          }

          function displayWatershed(result, messages) {
              alert("123");
              var polySymbol = new SimpleFillSymbol();
              polySymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 0.5]), 1));
              polySymbol.setColor(new Color([255, 127, 0, 0.7]));
              var features = result.value.features;
              for (var f = 0, fl = features.length; f < fl; f++) {
                  var feature = features[f];
                  feature.setSymbol(polySymbol);
                  map.graphics.add(feature);
              }
              map.setExtent(graphicsUtils.graphicsExtent(map.graphics.graphics), true);
          }

          //adds public functions to variable app
          app = {run_service: run_service};
    });
