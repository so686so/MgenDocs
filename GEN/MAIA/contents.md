
# <center>MAIA / AI 엔진 모델 명세</center>

<center>AI Engine Model Specification</center>

&nbsp;

<center>해당 문서는 AI 엔진 모델에 대한 명세 문서를 작성하는 방법에 대한 매뉴얼입니다.</center>
<center><span style="color:red">이 문서를 임의로 수정하지 마십시오.</span></center>

## Requirements

- 신규 AI 엔진 모델 추가 시 아래 **3개 파일의 추가/수정이 필요**합니다.

```shell
    ├── EngineSettings.json (수정)
    ├── [profile]
    │   └── new_engine.profile.json (추가)
    └── [classes]
        └── new_engine.classes.yaml (추가)
```

| 파일 이름 | 설명 |
|---------|------|
| [EngineSettings.json](#enginesettings-json) | 서비스에 적용할 전체 AI 엔진들의 목록 파일 |
| [new_engine.profile.json](#engineprofile) | 신규 AI 엔진에 대한 상세 프로필 정보 |
| [new_engine.classes.yaml](#engineclasses) | 신규 AI 엔진의 클래스 정보 |

&nbsp;

## EngineSettings.json

- MAIA 서비스에 적용할 **모든 AI 엔진 모델에 대한 개요**를 `{MAIA_ROOT}/EngineSettings.json`에 명시합니다.

### EngineSettings.json | Sample

```json
{
    "MAIA_ROOT": "/MAIA", // 수정 금지
    "Engines": [
        {
            "TagName": "Asan_v1.0.5_enhanced_night",
            "EngineFilePath": "MAIA_ROOT/engine/2402_mgen_v0.2.engine",
            "ProfilePath": "MAIA_ROOT/engine/profile/2402_mgen_v0.2.profile.json",
            "ClassesPath": "MAIA_ROOT/engine/classes/2402_mgen_v0.2.classes.yaml",
            "Enable": true
        },
        {
            "TagName": "Fire_v0.0.1_only_fire",
            "EngineFilePath": "MAIA_ROOT/engine/yolov5l_nc8_bs4_trt_turing_250207.engine",
            "ProfilePath": "MAIA_ROOT/engine/profile/fire_event_only_001.profile.json",
            "ClassesPath": "MAIA_ROOT/engine/classes/2402_mgen_v0.2.classes.yaml",
            "Enable": false
        }
    ]
}
```

- **AI 엔진별 프로필 파일 경로**를 지정할 때는 `MAIA_ROOT/engine/profile/...` 형태로 작성합니다. [(예시)](#engineprofile-sample)
- **AI 엔진별 클래스 파일 경로**를 지정할 때는 `MAIA_ROOT/engine/classes/...` 형태로 작성합니다. [(예시)](#engineclasses-sample)
- 해당 JSON 내부의 `MAIA_ROOT` 값은 실제 서비스 도커 **내부**의 고정된 값으로써, 도커 외부의 경로(~/MAIA)와 다를 수 있습니다.


### EngineSettings.json | Key

| 키 이름 | 설명 |
|---------|------|
| MAIA_ROOT | MAIA 서비스의 최상단 루트 경로. <br>Const 값으로, 개발자가 아닌 경우 수정 금지 |
| Engines | 로드할 엔진들의 리스트 |
| TagName | 사용자가 해당 엔진을 판별하기 위한 이름값. <br>서비스 내부적으로 오류 발생 등 로그 처리 시 해당 이름 출력 |
| EngineFilePath | 해당 엔진 파일의 실제 위치 경로. <br>일반적으로 `MAIA_ROOT/engine` 폴더에 위치 |
| ProfilePath | 해당 엔진 파일의 상세 명세 내역. <br>일반적으로 `MAIA_ROOT/engine/profile` 폴더에 위치 |
| ClassesPath | 클래스명 및 ID index 정의 파일 경로. <br>일반적으로 `MAIA_ROOT/engine/classes` 폴더에 위치 |
| Enable | 해당 엔진 사용 여부 (true/false) |

&nbsp;

## EngineProfile

- 개별 AI Engine 파일에 대한 상세 프로필을 각 엔진별로 작성합니다. **(JSON)**

### EngineProfile | Sample

```json
// MAIA_ROOT/engine/profile/2402_mgen_v0.2.profile.json
{
  "ProfileName": "YoloV5_EnhancedNight",
  "ModelMajorType": "Detection",
  "ModelMinorType": "YoloV5",
  "ModelMagicType": "EnhancedNightVersion",
  "Priority": 1,
  "InferenceBatchSize": 4,
  "InferenceWeight": 20,
  "InputImageWidth": 640,
  "InputImageHeight": 640,
  "GpuAllocType": "All",
  "ModelOptimizeType": "TensorRT",
  "OptimizeGpuArchType": "Turing"
}
```

### EngineProfile | Key

| 키 이름 | 설명 |
|---------|------|
| ProfileName | 프로필 식별용 이름. 오류 로그 등에서 프로필을 명시하기 위해 사용 |
| [ModelMajorType](#modelmajortype) | 모델의 대분류. <br>Detection, Attribute, Segmentation 등 모델의 탐지 방식에 따른 분류|
| [ModelMinorType](#modelminortype) | 모델의 세부 분류. <br>YoloV5, YoloX, ResNet50 등 실제 모델에 대한 분류|
| ModelMagicType | 사용자 정의 태그. 동일 모델 종류에서 특정 엔진을 식별하기 위한 식별자 |
| Priority | 동일 분류 단계에서의 우선 순위. <br>숫자가 낮을수록 우선순위 높음(1~99 사이의 값) |
| InferenceBatchSize | 추론 시 batch 크기 설정 |
| InferenceWeight | 추론 속도 기반 엔진 선택 가중치. <br>숫자가 작을수록 추론에 리소스 적게 소모 (1~100 사이의 값) |
| InputImageWidth | 추론 입력 이미지의 가로 픽셀 크기 |
| InputImageHeight | 추론 입력 이미지의 세로 픽셀 크기 |
| [GpuAllocType](#gpualloctype) | GPU 할당 방식. One, Half, All 중 하나 |
| [ModelOptimizeType](#modeloptimizetype) | 모델 최적화 방식. TensorRT, ONNX, RTX 등 |
| [OptimizeGpuArchType](#optimizegpuarchtype) | GPU 최적화 아키텍처. Turing, Ampere, AdaLovelace, Hopper 등 |

#### GpuAllocType

| 값 | 설명 |
|-----|------|
| One | 1개의 GPU에 할당 |
| Half | GPU 1/2개에 할당 (GPU가 4개라면 2개 할당) |
| All | 전체 GPU에 할당 |
<div style="text-align: right"><a href="#engineprofile-key">[▲]</a></div>

#### OptimizeGpuArchType

| 값 | 설명 |
|--------------|------------------------------|
| Turing       | 튜링 아키텍처 (RTX 20xx)     |
| Ampere       | 암페어 아키텍처 (RTX 30xx)   |
| AdaLovelace  | 에이다 러브레이스 (RTX 40xx)|
| Hopper       | 호퍼 아키텍처 (H100 등)      |
<div style="text-align: right"><a href="#engineprofile-key">[▲]</a></div>

#### ModelMajorType

| 값 | 설명 |
|----------------|-------------------|
| None           | 없음              |
| Detection      | 객체 탐지         |
| Attribute      | 속성 분석         |
| Segmentation   | 이미지 분할       |
| PoseEstimation | 자세 추정         |
<div style="text-align: right"><a href="#engineprofile-key">[▲]</a></div>

#### ModelMinorType

| 값     | 설명         |
|--------|--------------|
| None   | 없음         |
| YoloV5 | YOLOv5 모델 |
| YoloV7 | YOLOv7 모델 |
| YoloV8 | YOLOv8 모델 |
| YoloV10| YOLOv10 모델|
| ResNet50| ResNet50   |
| OpenPose| OpenPose   |
<div style="text-align: right"><a href="#engineprofile-key">[▲]</a></div>

#### ModelOptimizeType

| 값      | 설명             |
|---------|------------------|
| None    | 최적화 없음      |
| Onnx    | ONNX 형식 최적화 |
| TensorRT| TensorRT 최적화  |
| RTX     | RTX용 최적화     |
<div style="text-align: right"><a href="#engineprofile-key">[▲]</a></div>

&nbsp;

## EngineClasses

- 개별 AI Engine 파일에 대한 클래스 정보를 각 엔진별로 작성합니다. **(YAML)**

### EngineClasses | Sample

```yaml
# MAIA_ROOT/engine/classes/2402_mgen_v0.2.classes.yaml

num_class: 8

names:
  0 : Person
  1 : Car
  2 : Fire
  3 : Smoke
  4 : Pet
  5 : Cone
  6 : Light
  7 : NonFire
```
### EngineClasses | Key

| 키 이름 | 설명 |
|---------|------|
| num_classes | 엔진의 총 클래스 갯수. <br>offset만 존재하는 클래스여도 클래스 수에 포함 |
| names | 실제 클래스 표기. <br>각 클래스 ID를 키값으로 하는 클래스 이름 기입. <br>offset만 존재하는 클래스여도 index(ID) 존재시 기입 |

&nbsp;

&nbsp;

---
**<center>AI Engine Model Specification V1.0.0</center>**
<center>Last Updated: 2025-04-08</center>