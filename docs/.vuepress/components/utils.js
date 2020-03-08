import * as cga from "../../../src/";
import {
    BufferGeometry,
    Geometry,
    Line,
    LineDashedMaterial,
    Float32BufferAttribute,
    PointsMaterial,
    Points,
    LineBasicMaterial,
    Mesh,
    Face3,
    DoubleSide,
    MeshBasicMaterial,
    CircleGeometry,
    Quaternion,
    Matrix4
} from "three";
import { clamp, trianglation } from "../../../src/";
function randomGeo(key) {
    switch (key)
    {
        case "Point":
            return new cga.Point().copy(randomV3());
        case "Line":
            return new cga.Line(randomV3(), randomV3());
        case "Ray":
            return new cga.Ray(randomV3(), randomV3().normalize())
        case "Segment":
            return new cga.Segment(randomV3(), randomV3());
        case "Polyline":
            var vs = [];
            for (let i = 0; i < Math.floor(Math.random() * 100 + 3); i++)
            {
                vs.push(randomV3());
            }
            return new cga.Polyline(vs);
        case "Triangle":
            return new cga.Triangle(randomV3(200), randomV3(200), randomV3(200));

        case "Circle":
            return new cga.Circle(randomV3(), randomV3().normalize(), Math.random() * 60 + 5);

        case "Disk":
            return new cga.Disk(randomV3(), randomV3().normalize(), Math.random() * 60 + 5);

        case "Capsule":
            return new cga.Capsule(randomV3(), randomV3());

    }
}

export function poufeng(polygon) {
    trianglation(polygon)
}

export function initTestScene(geoKey1, geoKey2, scene) {
    var geo0 = randomGeo(geoKey1);
    var geo1 = randomGeo(geoKey2);;
    var result = geo0["distance" + geoKey2](geo1);
    scene.add(toMesh(geo0));
    scene.add(toMesh(geo1));
    if (result.closests && result.closests.length === 2)
    {
        scene.add(toDisSeg(result.closests))
    }
    // if (geo0 instanceof cga.Point && (geo1 instanceof cga.Circle || geo1 instanceof cga.Disk
    // ))
    // {
    //     // scene.add(toDisSeg([geo0, geo1.center]))
    // }
    return result;
}

export function randomV3(range = 100) {
    return cga.v3(Math.random() * range - range / 2, Math.random() * range, Math.random() * range - range / 3);
}


export function getQuaternionForm2V(v1, v2) {
    var vc1 = v1.clone().normalize();
    var vc2 = v2.clone().normalize();
    var n = vc1
        .clone()
        .cross(vc2)
        .normalize();
    var rq = new Quaternion();
    var angle = clamp(vc1.normalize().dot(vc2.normalize()), -1, 1);
    angle = Math.acos(angle);
    rq.setFromAxisAngle(n, angle);

    return rq;
}

export function toDisSeg(obj, opts) {
    var geometry = new Geometry()
    geometry.vertices.push(...obj)
    var material = new LineDashedMaterial({
        color: 0xff0000,
        dashSize: 1,
        gapSize: 1,
        scale: 1, // 比例越大，虚线越密；反之，虚线越疏
        ...opts
    });
    // debugger
    // Line.computeLineDistances(geometry);//
    var line = new Line(geometry, material);
    line.computeLineDistances();
    return line;
}

export function toMesh(obj, materialOption) {
    var renderObj = null;
    if (obj instanceof cga.Point || obj.isVector3)
    {
        var geometry = new BufferGeometry()
        geometry.setAttribute('position', new Float32BufferAttribute([obj.x, obj.y, obj.z], 3));
        var material = new PointsMaterial({ size: 5, sizeAttenuation: false, color: 0x0ff0f0, alphaTest: 0.9, transparent: true });
        renderObj = new Points(geometry, material);

    } else if (obj instanceof cga.Line)
    {
        var geometry = new Geometry()
        var v1 = obj.direction.clone().multiplyScalar(10000).add(obj.origin);
        var v2 = obj.direction.clone().multiplyScalar(-10000).add(obj.origin);
        geometry.vertices.push(v1, v2);
        var material = new LineBasicMaterial({ color: 0xffff8f });
        renderObj = new Line(geometry, material);

    } else if (obj instanceof cga.Ray)
    {
        var geometry = new Geometry()
        var v1 = obj.direction.clone().multiplyScalar(10000).add(obj.origin);
        geometry.vertices.push(obj.origin, v1);
        var material = new LineBasicMaterial({ color: 0xff8fff });
        renderObj = new Line(geometry, material);
    } else if (obj instanceof cga.Segment)
    {
        var geometry = new Geometry()
        geometry.vertices.push(obj.p0, obj.p1);
        var material = new LineBasicMaterial({ color: 0x8fffff });
        renderObj = new Line(geometry, material);
    } else if (obj instanceof cga.Triangle)
    {
        var geometry = new Geometry()
        geometry.vertices = [...obj];
        geometry.faces.push(new Face3(0, 1, 2))
        var material = new MeshBasicMaterial({ color: 0x8f8fff, side: DoubleSide });
        renderObj = new Mesh(geometry, material);
    }

    else if (obj instanceof cga.Polyline)
    {
        var geometry = new Geometry()
        geometry.vertices.push(...obj);
        var material = new LineBasicMaterial({ color: 0xff8fff });
        renderObj = new Line(geometry, material);
    } else if (obj instanceof cga.Polygon)
    {

    } else if (obj instanceof cga.Circle)
    {
        var geometry = new Geometry()
        var radius = obj.radius;
        for (let i = 0; i <= 128; i++)
        {
            var p = new cga.Vector3();
            p.x = radius * Math.cos(Math.PI / 64 * i);
            p.y = radius * Math.sin(Math.PI / 64 * i);
            geometry.vertices.push(p);
        }
        var quaternion = getQuaternionForm2V(new cga.Vector3(0, 0, 1), obj.normal);
        var mat4 = new Matrix4();
        mat4.makeRotationFromQuaternion(quaternion);
        geometry.applyMatrix(mat4);
        geometry.translate(obj.center.x, obj.center.y, obj.center.z);
        var material = new LineBasicMaterial({ color: 0x8fffff });
        renderObj = new Line(geometry, material);
        renderObj.add(new toMesh(obj.center))
        renderObj.add(new toMesh(new cga.Ray(obj.center, obj.normal)))
    }
    else if (obj instanceof cga.Disk)
    {
        var geometry = new CircleGeometry(obj.radius, 128)
        var material = new MeshBasicMaterial({ color: 0x8f8fff, side: DoubleSide });
        var quaternion = getQuaternionForm2V(new cga.Vector3(0, 0, 1), obj.normal);
        var mat4 = new Matrix4();
        mat4.makeRotationFromQuaternion(quaternion);
        geometry.applyMatrix(mat4);
        geometry.translate(obj.center.x, obj.center.y, obj.center.z);
        renderObj = new Mesh(geometry, material);
        renderObj.add(new toMesh(obj.center))
        renderObj.add(new toMesh(new cga.Ray(obj.center, obj.normal)))
    }

    return renderObj;

}



// 格式方法
// 公共方法
function transitionJsonToString(jsonObj, callback) {
    // 转换后的jsonObj受体对象
    var _jsonObj = null;
    // 判断传入的jsonObj对象是不是字符串，如果是字符串需要先转换为对象，再转换为字符串，这样做是为了保证转换后的字符串为双引号
    if (Object.prototype.toString.call(jsonObj) !== "[object String]")
    {
        try
        {
            _jsonObj = JSON.stringify(jsonObj);
        } catch (error)
        {
            // 转换失败错误信息
            console.error('您传递的json数据格式有误，请核对...');
            console.error(error);
            callback(error);
        }
    } else
    {
        try
        {
            jsonObj = jsonObj.replace(/(\')/g, '\"');
            _jsonObj = JSON.stringify(JSON.parse(jsonObj));
        } catch (error)
        {
            // 转换失败错误信息
            console.error('您传递的json数据格式有误，请核对...');
            console.error(error);
            callback(error);
        }
    }
    return _jsonObj;
}
// callback为数据格式化错误的时候处理函数
export function formatJson(jsonObj, callback) {
    // 正则表达式匹配规则变量
    var reg = null;
    // 转换后的字符串变量
    var formatted = '';
    // 换行缩进位数
    var pad = 0;
    // 一个tab对应空格位数
    var PADDING = '    ';
    // json对象转换为字符串变量
    var jsonString = transitionJsonToString(jsonObj, callback);
    if (!jsonString)
    {
        return jsonString;
    }
    // 存储需要特殊处理的字符串段
    var _index = [];
    // 存储需要特殊处理的“再数组中的开始位置变量索引
    var _indexStart = null;
    // 存储需要特殊处理的“再数组中的结束位置变量索引
    var _indexEnd = null;
    // 将jsonString字符串内容通过\r\n符分割成数组
    var jsonArray = [];
    // 正则匹配到{,}符号则在两边添加回车换行
    jsonString = jsonString.replace(/([\{\}])/g, '\r\n$1\r\n');
    // 正则匹配到[,]符号则在两边添加回车换行
    jsonString = jsonString.replace(/([\[\]])/g, '\r\n$1\r\n');
    // 正则匹配到,符号则在两边添加回车换行
    jsonString = jsonString.replace(/(\,)/g, '$1\r\n');
    // 正则匹配到要超过一行的换行需要改为一行
    jsonString = jsonString.replace(/(\r\n\r\n)/g, '\r\n');
    // 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
    jsonString = jsonString.replace(/\r\n\,/g, ',');
    // 特殊处理双引号中的内容
    jsonArray = jsonString.split('\r\n');
    jsonArray.forEach(function (node, index) {
        // 获取当前字符串段中"的数量
        var num = node.match(/\"/g) ? node.match(/\"/g).length : 0;
        // 判断num是否为奇数来确定是否需要特殊处理
        if (num % 2 && !_indexStart)
        {
            _indexStart = index
        }
        if (num % 2 && _indexStart && _indexStart != index)
        {
            _indexEnd = index
        }
        // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
        if (_indexStart && _indexEnd)
        {
            _index.push({
                start: _indexStart,
                end: _indexEnd
            })
            _indexStart = null
            _indexEnd = null
        }
    })
    // 开始处理双引号中的内容，将多余的"去除
    _index.reverse().forEach(function (item, index) {
        var newArray = jsonArray.slice(item.start, item.end + 1)
        jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(''))
    })
    // 奖处理后的数组通过\r\n连接符重组为字符串
    jsonString = jsonArray.join('\r\n');
    // 将匹配到:后为回车换行加大括号替换为冒号加大括号
    jsonString = jsonString.replace(/\:\r\n\{/g, ':{');
    // 将匹配到:后为回车换行加中括号替换为冒号加中括号
    jsonString = jsonString.replace(/\:\r\n\[/g, ':[');
    // 将上述转换后的字符串再次以\r\n分割成数组
    jsonArray = jsonString.split('\r\n');
    // 将转换完成的字符串根据PADDING值来组合成最终的形态
    jsonArray.forEach(function (item, index) {
        console.log(item)
        var i = 0;
        // 表示缩进的位数，以tab作为计数单位
        var indent = 0;
        // 表示缩进的位数，以空格作为计数单位
        var padding = '';
        if (item.match(/\{$/) || item.match(/\[$/))
        {
            // 匹配到以{和[结尾的时候indent加1
            indent += 1
        } else if (item.match(/\}$/) || item.match(/\]$/) || item.match(/\},$/) || item.match(/\],$/))
        {
            // 匹配到以}和]结尾的时候indent减1
            if (pad !== 0)
            {
                pad -= 1
            }
        } else
        {
            indent = 0
        }
        for (i = 0; i < pad; i++)
        {
            padding += PADDING
        }
        formatted += padding + item + '\r\n'
        pad += indent
    })
    // 返回的数据需要去除两边的空格
    return formatted.trim();
}