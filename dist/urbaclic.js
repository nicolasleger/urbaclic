/*! 22-03-2016 */
var urbaClic, urbaClicUtils = {};

urbaClicUtils.urlify = function(text) {
    if ("string" != typeof text) return text;
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + "</a>";
    });
}, urbaClicUtils.baseLayers = {
    "OSM-Fr": {
        title: "OSM-Fr",
        url: "//tilecache.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
    },
    Positron: {
        title: "Positron",
        url: "//cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    },
    Outdoors_OSM: {
        title: "Outdoors (OSM)",
        url: "//{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png"
    },
    OSM_Roads: {
        title: "OSM Roads",
        url: "//korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}"
    },
    Dark_Matter: {
        title: "Dark Matter",
        url: "//cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
    },
    OpenStreetMap: {
        title: "OpenStreetMap",
        url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    Toner: {
        title: "Toner",
        url: "//{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png"
    },
    Landscape: {
        title: "Landscape",
        url: "//{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png"
    },
    Transport: {
        title: "Transport",
        url: "//{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"
    },
    MapQuest_Open: {
        title: "MapQuest Open",
        url: "//otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png"
    },
    HOTOSM_style: {
        title: "HOTOSM style",
        url: "//tilecache.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    },
    OpenCycleMap: {
        title: "OpenCycleMap",
        url: "//{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
    },
    Watercolor: {
        title: "Watercolor",
        url: "//{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png"
    },
    hikebikemap: {
        title: "hikebikemap",
        url: "//toolserver.org/tiles/hikebike/{z}/{x}/{y}.png"
    },
    "OSM-monochrome": {
        title: "OSM-monochrome",
        url: "//www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png"
    },
    Hydda: {
        title: "Hydda",
        url: "//{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
    },
    OpenTopoMap: {
        title: "OpenTopoMap",
        url: "//{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
    },
    OpenRiverboatMap: {
        title: "OpenRiverboatMap",
        url: "//tilecache.openstreetmap.fr/openriverboatmap/{z}/{x}/{y}.png"
    }
}, jQuery(document).ready(function($) {
    var Templates = {}, sortDesc = !1;
    Templates.autocomplete = [ "{{#each features}}", '<li><a href="#" data-feature="{{jsonencode .}}" data-type="{{properties.type}}" tabindex="1000">', "   {{marks properties.label ../query}}", "   &nbsp;<i>{{_ properties.type}}</i>", "</a></li>", "{{/each}}" ], 
    Templates.shareLink = [ '<div class="uData-shareLink">', '<div class="linkDiv"><a href="#">intégrez cet outil de recherche sur votre site&nbsp;<i class="fa fa-share-alt"></i></a></div>', '<div class="hidden">', "   <h4>Vous pouvez intégrer cet outil de recherche de données sur votre site</h4>", "   <p>Pour ceci collez le code suivant dans le code HTML de votre page</p>", "   <pre>", "&lt;script&gt;window.jQuery || document.write(\"&lt;script src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js'&gt;&lt;\\/script&gt;\")&lt;/script&gt;", "", "&lt;!-- chargement feuille de style font-awesome --&gt;", '&lt;link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css"&gt;', "", '&lt;script src="{{baseUrl}}udata.js"&gt;&lt;/script&gt;', '&lt;div class="uData-data"', '   data-q="{{q}}"', '   data-organizations="{{organizationList}}"', '   data-organization="{{organization}}"', '   data-page_size="{{page_size}}"', "&gt&lt;/div&gt", "   </pre>", "   <p>vous pouvez trouver plus d'info sur cet outil et son paramétrage à cette adresse: <a href='https://github.com/DepthFrance/udata-js' target='_blank'>https://github.com/DepthFrance/udata-js</a></p>", "</div>", "</div>" ], 
    Templates.parcelleData = [ '<p class="latlng">{{latlng.lat}}, {{latlng.lng}}</p>', '{{#ifCond cadastre "!=" undefined}}', '<div class="cadastre">', "<h4>cadastre</h4>", "<ul>", '<li class="parcelle_id">ID: {{parcelle_id}}</li>', '<li class="code_dep">code_dep: {{cadastre.code_dep}}</li>', '<li class="code_com">code_com: {{cadastre.code_com}}</li>', '<li class="nom_com">nom_com: {{cadastre.nom_com}}</li>', '<li class="code_arr">code_arr: {{cadastre.code_arr}}</li>', '<li class="com_abs">com_abs: {{cadastre.com_abs}}</li>', '<li class="feuille">feuille: {{cadastre.feuille}}</li>', '<li class="section">section: {{cadastre.section}}</li>', '<li class="numero">numero: {{cadastre.numero}}</li>', '<li class="surface_parcelle">surface: {{round cadastre.surface_parcelle}}m²</li>', "</ul>", "</div>", "{{/ifCond}}", '{{#ifCond adresse "!=" null}}', '<div class="adresse">', "<h4>adresse</h4>", "<ul>", "<li>{{adresse.name}} {{adresse.postcode}} {{adresse.city}}</li>", "</ul>", "</div>", "{{/ifCond}}", '<div class="servitudes">', "<h4>servitudes</h4>", "<ul>", "{{#each servitudes}}", "<li>{{type}} {{nom}} id:{{id}}</li>", "{{/each}}", "</ul>", "</div>" ];
    var baseUrl = jQuery('script[src$="/main.js"]')[0].src.replace("/main.js", "/../dist/"), _urbaclic = {};
    urbaClic = function(obj, options) {
        var container = obj, cadastre_min_zoom = 17, map = null, layers = {
            ban: null,
            adresse: null,
            parcelles: null
        }, backgroundLayers = {}, urbaClic_options = {
            showMap: !0,
            showData: !0,
            sharelink: !1,
            getadresse: !1,
            getservitude: !0,
            sharelink: !1,
            autocomplete_limit: 50,
            leaflet_map_options: {},
            background_layers: [ "OpenStreetMap", "MapQuest_Open", "OpenTopoMap" ]
        }, ban_query = null, cadastre_query = null, cadastre_query2 = null, zoom_timeout = null, focusOff_timeout = null, current_parcelle = {
            loadings: []
        };
        urbaClic_options = jQuery.extend(urbaClic_options, options);
        var autocomplete_params = {};
        for (var i in urbaClic_options) if (0 == i.search("autocomplete_")) {
            var k = i.substring("autocomplete_".length);
            autocomplete_params[k] = urbaClic_options[i];
        }
        var input = container.find("#urbaclic-search"), ban_options = autocomplete_params, default_template = function(feature) {
            var html = "";
            return jQuery.each(feature.properties, function(k, v) {
                html += "<tr><th>" + k + "</th><td>" + urbaClicUtils.urlify(v) + "</td></tr>";
            }), html = '<table class="table table-hover table-bordered">' + html + "</table>";
        }, circle_pointToLayer = function(feature, latlng) {
            var geojsonMarkerOptions = {
                radius: 3
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }, updateLayerController = function() {
            var loadedLayers = [];
            for (var i in layers) null != layers[i] && (loadedLayers[i] = layers[i]);
            map.layerController.removeFrom(map), map.layerController = L.control.layers(backgroundLayers, loadedLayers).addTo(map);
        };
        _urbaclic.addBackground = function(title, layer, show) {
            backgroundLayers[title] = layer, show === !0 && layer.addTo(map), updateLayerController();
        };
        var autocomplete = function() {
            zoom_timeout && clearTimeout(zoom_timeout), layers.ban && map.removeLayer(layers.ban), 
            layers.adresse && map.removeLayer(layers.adresse), layers.adresse = null, ban_query && ban_query.abort(), 
            input.prop("tabindex", 1e3);
            var t = input.val();
            if (t.length > 1) {
                var ul = container.find("ul.urbaclic-autocomplete");
                ul.length || (ul = jQuery('<ul class="urbaclic-autocomplete"></ul>').insertAfter(input).hide(), 
                ul.css("top", input.outerHeight() - 2));
                var url = BAN_API + "search/", params = ban_options;
                params.q = t, ban_query = jQuery.getJSON(url, params, function(data) {
                    if (ban_query = null, data.features.length) {
                        ul.html(Templates.autocomplete(data)).slideDown();
                        var layer = L.geoJson(data, {
                            pointToLayer: circle_pointToLayer,
                            style: {
                                className: "ban"
                            }
                        }).addTo(map);
                        zoom_timeout = setTimeout(function() {
                            map.fitBounds(layer.getBounds());
                        }, 500), layer.on("click", function(e) {
                            var feature = e.layer.feature, type = feature.properties.type;
                            loadParcelle({
                                feature: feature,
                                type: type
                            });
                        }), layer.bringToFront(), layers.ban = layer, updateLayerController();
                        var tbindex = 1e3;
                        container.find("ul.urbaclic-autocomplete a").each(function() {
                            tbindex++, jQuery(this).prop("tabindex", tbindex);
                        });
                    } else ul.html("").fadeOut();
                });
            } else container.find("ul.urbaclic-autocomplete").html("").slideUp();
        };
        if (urbaClic_options.showMap) {
            jQuery(".urbaclic-map").length || jQuery('<div class="urbaclic-map"></div>').appendTo(container), 
            map = L.map(jQuery(".urbaclic-map")[0], urbaClic_options.leaflet_map_options).setView([ 46.6795944656402, 2.197265625 ], 4), 
            map.attributionControl.setPrefix(""), map.layerController = L.control.layers([], []).addTo(map);
            for (var i in urbaClic_options.background_layers) {
                var bl = urbaClic_options.background_layers[i];
                if ("string" == typeof bl) if (void 0 != urbaClicUtils.baseLayers[bl]) bl = urbaClicUtils.baseLayers[bl]; else try {
                    bl = eval(bl);
                } catch (err) {
                    console.log(err.message);
                }
                var l = L.tileLayer(bl.url), t = bl.title;
                _urbaclic.addBackground(t, l, 0 == i);
            }
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map), map.on("moveend", function() {
                if (cadastre_query2 && cadastre_query2.abort(), map.getZoom() >= cadastre_min_zoom) {
                    var url = Cadastre_API + "cadastre/geometrie", rect = L.rectangle(map.getBounds()), qparams = {
                        geom: JSON.stringify(rect.toGeoJSON())
                    };
                    cadastre_query2 = jQuery.getJSON(url, qparams, function(data) {
                        if (data.features.length) {
                            var layer = L.geoJson(data, {
                                onEachFeature: function(feature, layer) {
                                    if (urbaClic_options.showMap) layer.on("click", function(e) {
                                        showData(feature, layer, e);
                                    }); else {
                                        var html = default_template(feature);
                                        layer.bindPopup(html);
                                    }
                                },
                                style: {
                                    className: "parcelles"
                                }
                            });
                            layers.parcelles && map.removeLayer(layers.parcelles), layers.parcelles = null, 
                            layer.addTo(map), layer.bringToBack(), layers.parcelles = layer, updateLayerController();
                        } else console.info("aucune parcelle trouvée");
                    });
                } else layers.parcelles && (map.removeLayer(layers.parcelles), layers.parcelles = null, 
                updateLayerController());
            });
        }
        var addAdressLayer = function(data) {
            layers.adresse && map.removeLayer(layers.adresse);
            var layer = L.geoJson(data, {
                onEachFeature: function(feature, layer) {
                    var html = default_template(feature);
                    layer.bindPopup(html);
                },
                style: {
                    className: "adresse"
                }
            }).addTo(map);
            return layers.adresse = layer, updateLayerController(), layer;
        }, loadParcelle = function(params) {
            focusOff(), zoom_timeout && clearTimeout(zoom_timeout);
            var adresse_json = {
                type: "FeatureCollection",
                features: [ params.feature ]
            }, layer = addAdressLayer(adresse_json);
            map.fitBounds(layer.getBounds());
        }, showData = function(feature, layer, evt) {
            var parcelleId = [ feature.properties.code_dep, feature.properties.code_com ];
            "000" != feature.properties.code_arr ? parcelleId.push(feature.properties.code_arr) : parcelleId.push(feature.properties.com_abs);
            for (var i in layer._layers) layer._layers[i]._container.setAttribute("class", "active");
            parcelleId.push(feature.properties.section), parcelleId.push(feature.properties.numero), 
            parcelleId = parcelleId.join(""), urbaClic_options.showData && (jQuery(".urbaclic-data").length || jQuery('<div class="urbaclic-data"></div>').appendTo(container)), 
            current_parcelle.data = {
                latlng: evt.latlng,
                parcelle_id: parcelleId,
                cadastre: feature.properties,
                adresse: null,
                servitudes: []
            };
            for (var i in current_parcelle.loadings) current_parcelle.loadings[i].abort();
            if (jQuery(".urbaclic-data").html(Templates.parcelleData(current_parcelle.data)), 
            urbaClic_options.getadresse) {
                var url = BAN_API + "reverse/", params = {
                    lon: current_parcelle.data.latlng.lng,
                    lat: current_parcelle.data.latlng.lat
                };
                current_parcelle.loadings.ban_query = jQuery.getJSON(url, params, function(data) {
                    addAdressLayer(data), void 0 != data.features[0] && (current_parcelle.data.adresse = data.features[0].properties, 
                    jQuery(".urbaclic-data").html(Templates.parcelleData(current_parcelle.data)));
                });
            }
            if (urbaClic_options.getservitude) {
                var res_exemple = [ {
                    type: "AC1",
                    nom: "Église Saint-Étienne",
                    surfaceIntersection: 1234,
                    id: 12345
                } ];
                current_parcelle.data.servitudes = res_exemple, jQuery(".urbaclic-data").html(Templates.parcelleData(current_parcelle.data));
            }
        }, focusOff = function() {
            container.find("ul.urbaclic-autocomplete").slideUp();
        };
        return input.keydown(function(e) {
            setTimeout(autocomplete, 10);
        }).focusin(function() {
            clearTimeout(focusOff_timeout), container.find("ul.urbaclic-autocomplete").slideDown();
        }).focusout(function() {
            clearTimeout(focusOff_timeout), focusOff_timeout = setTimeout(focusOff, 200);
        }), container.on("click", "ul.urbaclic-autocomplete [data-feature]", function(e) {
            e.preventDefault(), loadParcelle(jQuery(this).data());
        }).on("mouseover", "ul.urbaclic-autocomplete", function(e) {
            clearTimeout(focusOff_timeout);
        }).on("focusin", "ul.urbaclic-autocomplete *", function(e) {
            clearTimeout(focusOff_timeout);
        }).on("focusout", "ul.urbaclic-autocomplete *", function(e) {
            clearTimeout(focusOff_timeout), focusOff_timeout = setTimeout(focusOff, 200);
        }), autocomplete(), _urbaclic.map = map, _urbaclic.loadParcelle = loadParcelle, 
        _urbaclic;
    };
    var BAN_API = "https://api-adresse.data.gouv.fr/", Cadastre_API = "https://apicarto.sgmap.fr/", checklibs = function() {
        var dependences = {
            Handlebars: "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.2/handlebars.min.js",
            i18n: "https://cdnjs.cloudflare.com/ajax/libs/i18next/1.6.3/i18next-1.6.3.min.js",
            L: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.js"
        }, css = {
            L: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css",
            css: baseUrl + "urbaclic.css"
        }, ready = !0;
        for (var i in css) 0 == jQuery('link[href="' + css[i] + '"]').length && jQuery('<link type="text/css" href="' + css[i] + '" rel="stylesheet">').appendTo("head");
        for (var i in dependences) "undefined" == typeof window[i] && (0 == jQuery('script[src="' + dependences[i] + '"]').length && jQuery('<script src="' + dependences[i] + '"></script>').appendTo("body"), 
        ready = !1);
        ready ? start() : setTimeout(checklibs, 100);
    }, start = function() {
        var container = _urbaclic.container;
        _urbaclic.lang = lang = "fr", i18n.init({
            resGetPath: baseUrl + "locales/urbaclic." + lang + ".json",
            lng: lang,
            load: "unspecific",
            interpolationPrefix: "{",
            interpolationSuffix: "}",
            fallbackLng: !1,
            fallbackOnEmpty: !0,
            fallbackOnNull: !0,
            nsseparator: "::",
            keyseparator: "$$"
        }, function(err, t) {}), Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
            switch (operator) {
              case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);

              case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);

              case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);

              case "<":
                return v2 > v1 ? options.fn(this) : options.inverse(this);

              case "<=":
                return v2 >= v1 ? options.fn(this) : options.inverse(this);

              case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);

              case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);

              case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);

              case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);

              default:
                return options.inverse(this);
            }
        }), Handlebars.registerHelper("ifCount", function(v1, operator, v2, options) {
            var v1 = v1.length;
            switch (operator) {
              case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);

              case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);

              case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);

              case "<":
                return v2 > v1 ? options.fn(this) : options.inverse(this);

              case "<=":
                return v2 >= v1 ? options.fn(this) : options.inverse(this);

              case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);

              case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);

              case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);

              case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);

              default:
                return options.inverse(this);
            }
        }), Handlebars.registerHelper("mark", function(text, key) {
            var match = text.match(new RegExp(key.trim(), "gi")), uniqueMatch = [];
            jQuery.each(match, function(i, el) {
                -1 === jQuery.inArray(el, uniqueMatch) && uniqueMatch.push(el);
            });
            for (var i in uniqueMatch) text = text.replace(new RegExp(uniqueMatch[i], "g"), "[** " + uniqueMatch[i] + " **]");
            return text = text.replace(/\[\*\* /g, "<mark>").replace(/ \*\*\]/g, "</mark>"), 
            new Handlebars.SafeString(text);
        }), Handlebars.registerHelper("marks", function(text, key) {
            var keys = key.trim().split(" ");
            for (var i in keys) {
                key = keys[i];
                var match = text.match(new RegExp(key, "gi")), uniqueMatch = [];
                jQuery.each(match, function(i, el) {
                    -1 === jQuery.inArray(el, uniqueMatch) && uniqueMatch.push(el);
                });
                for (var i in uniqueMatch) text = text.replace(new RegExp(uniqueMatch[i], "g"), "[** " + uniqueMatch[i] + " **]");
            }
            return text = text.replace(/\[\*\* /g, "<mark>").replace(/ \*\*\]/g, "</mark>"), 
            new Handlebars.SafeString(text);
        }), Handlebars.registerHelper("paginate", function(n, total, page_size) {
            var res = "", nPage = Math.ceil(total / page_size);
            if (1 == nPage) return "";
            for (var i = 1; nPage >= i; ++i) res += "<li" + (i == n ? ' class="active"' : "") + ">", 
            res += '<a href="#" data-page=' + i + ">" + i + "</a></li>";
            return '<nav><ul class="pagination">' + res + "</ul></nav>";
        }), Handlebars.registerHelper("taglist", function(tags) {
            var res = "";
            for (var i in tags) res += "<span class='label label-primary' >" + tags[i] + "</span> ";
            return res;
        }), Handlebars.registerHelper("trimString", function(passedString) {
            if (passedString.length > 150) {
                var theString = passedString.substring(0, 150) + "...";
                return new Handlebars.SafeString(theString);
            }
            return passedString;
        }), Handlebars.registerHelper("uppercase", function(passedString) {
            return passedString.toUpperCase();
        }), Handlebars.registerHelper("round", function(passedString) {
            return Math.round(parseFloat(passedString));
        }), Handlebars.registerHelper("truncate", function(str, len) {
            if (str && str.length > len && str.length > 0) {
                var new_str = str + " ";
                return new_str = str.substr(0, len), new_str = str.substr(0, new_str.lastIndexOf(" ")), 
                new_str = new_str.length > 0 ? new_str : str.substr(0, len), new Handlebars.SafeString(new_str + "...");
            }
            return str;
        }), Handlebars.registerHelper("default", function(value, defaultValue) {
            return null != value ? value : defaultValue;
        }), Handlebars.registerHelper("dt", function(value, options) {
            return moment(value).format(options.hash.format || "LLL");
        }), Handlebars.registerHelper("placeholder", function(url, type) {
            return url ? url : baseUrl + "img/placeholders/" + type + ".png";
        }), Handlebars.registerHelper("_", function(value, options) {
            if (!value || "string" != typeof value) return "";
            options.hash.defaultValue = "???";
            var res = i18n.t(value, options.hash);
            return "???" == res && (value = value.charAt(0).toLowerCase() + value.slice(1), 
            res = i18n.t(value, options.hash), res = res.charAt(0).toUpperCase() + res.slice(1)), 
            "???" == res && (value = value.charAt(0).toUpperCase() + value.slice(1), res = i18n.t(value, options.hash), 
            res = res.charAt(0).toLowerCase() + res.slice(1)), "???" == res ? (console.warn('i18n "' + value + '" NOT FOUND'), 
            value) : res;
        }), Handlebars.registerHelper("md", function(value) {
            return new Handlebars.SafeString(marked(value));
        }), Handlebars.registerHelper("mdshort", function(value, length) {
            if (value) {
                var EXCERPT_TOKEN = "<!--- --- -->", DEFAULT_LENGTH = 128;
                "undefined" == typeof length && (length = DEFAULT_LENGTH);
                var text, ellipsis;
                return value.indexOf("<!--- excerpt -->") && (value = value.split(EXCERPT_TOKEN, 1)[0]), 
                ellipsis = value.length >= length ? "..." : "", text = marked(value.substring(0, length) + ellipsis), 
                text = text.replace("<a ", "<span ").replace("</a>", "</span>"), new Handlebars.SafeString(text);
            }
        }), Handlebars.registerHelper("theme", function(value) {
            return new Handlebars.SafeString(baseUrl + "" + value);
        }), Handlebars.registerHelper("fulllogo", function(value) {
            return new Handlebars.SafeString(value);
        }), Handlebars.registerHelper("jsonencode", function(value) {
            return JSON.stringify(value, null, 4);
        });
        for (var tmpl in Templates) {
            var template_surcharge_id = "udata_template_" + tmpl;
            console.info("load template: #" + template_surcharge_id);
            var t = jQuery("#" + template_surcharge_id).first();
            t.length ? (Templates[tmpl] = t.html(), console.info("loaded.")) : console.info("not found, use default template."), 
            "string" != typeof Templates[tmpl] && (Templates[tmpl] = Templates[tmpl].join("\n")), 
            Templates[tmpl] = Handlebars.compile(Templates[tmpl]);
        }
        container = jQuery("#urbaclic"), container.length && (window.urbaClic_autoload = [], 
        container.each(function() {
            var obj = jQuery(this);
            window.urbaClic_autoload.push(urbaClic(obj, obj.data()));
        }));
    };
    checklibs();
});