const mongoose = require('mongoose');
const { Schema } = mongoose;

const bloodTestSchema = new Schema({
    completeBloodCount: {
        redBloodCells: Number,
        hemoglobin: Number,
        hematocrit: Number,
        whiteBloodCellCount: Number,
        plateletCount: Number,
        meanRedBloodCellIndex: Number,
        meanHemoglobinIndex: Number,
        meanHemoglobinConcentrationIndex: Number,
        redBloodCellDistributionWidth: Number
    },
    bloodBiochemistry: {
        glucose: Number,
        cholesterol: Number,
        lowDensityLipoprotein: Number,
        highDensityLipoprotein: Number,
        triglycerides: Number,
        alanineAminotransferase: Number,
        aspartateAminotransferase: Number,
        bilirubin: Number,
        albumin: Number,
        totalProtein: Number,
        creatinine: Number,
        bloodUreaNitrogen: Number,
        sodium: Number,
        potassium: Number,
        chloride: Number,
        bicarbonate: Number,
        calcium: Number,
        phosphorus: Number,
        magnesium: Number,
        thyroidStimulatingHormone: Number,
        T3: Number,
        T4: Number,
        uricAcid: Number,
        lactateDehydrogenase: Number,
        cReactiveProtein: Number
    },
    coagulationTest: {
        prothrombinTime: Number,
        partialThromboplastinTime: Number,
        internationalNormalizedRatio: Number,
        fibrinogen: Number,
        dDimer: Number,
        plateletCount: Number,
        enhancedThrombinTime: Number
    },
    immunologicalTest: {
        antigen: String,
        cReactiveProtein: Number,
        sedimentationRate: Number,
        HLAtyping: String,
        antinuclearAntibody: String,
        rheumatoidFactor: String,
        antiDNAAntibodies: String,
        antiSmithAntibodies: String,
        complementLevels: {
            C3: Number,
            C4: Number
        },
        immunoglobulinLevels: {
            IgG: Number,
            IgM: Number,
            IgE: Number,
            IgA: Number
        },
        bLymphocyteCount: Number,
        cytokines: String,
        TlymphocyteSubsets: {
            CD4PlusTCells: Number,
            CD8PlusTCells: Number
        }
    },
    hormoneTest: {
        thyroidStimulatingHormone: Number,
        triiodothyronine: Number,
        thyroxine: Number,
        freeT3: Number,
        freeT4: Number,
        thyroidAntibodies: String,
        testosterone: Number,
        progesterone: Number,
        estrogen: Number,
        luteinizingHormone: Number,
        follicleStimulatingHormone: Number,
        cortisol: Number,
        adrenaline: Number,
        norepinephrine: Number,
        insulin: Number,
        growthHormone: Number,
        prolactin: Number,
        vitaminD: Number
    }
});

const urinalysisSchema = new Schema({
    color: String,
    clarity: String,
    pH: Number,
    specificGravity: Number,
    glucose: Number,
    bilirubin: Number,
    protein: Number,
    urobilinogen: Number,
    hemoglobin: Number,
    ketone: Number,
    nitrite: Number,
    leukocyteEsterase: Number,
    crystals: String,
    mucus: String,
    cells: {
        erythrocytes: Number,
        leukocytes: Number,
        epithelialCells: Number
    }
});

const xRayAndUltrasoundSchema = new Schema({
    image: String,
    diagnosis: String,
    name: String,
    description: String
});

const medicationSchema = new Schema({
    name: String,
    instructions: String,
    unitOfMeasure: String,
    quantity: Number
});

const medicalRecordSchema = new Schema({
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital' },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    results: {
        generalExamination: {
            temperature: Number,
            heartRate: Number,
            bloodPressure: {
                systolic: Number,
                diastolic: Number
            },
            breathingRate: Number,
            weight: Number,
            height: Number
        },
        detailedOrganExamination: {
            headAndNeck: {
                eyes: String,
                ears: String,
                nose: String,
                throat: String,
                thyroid: String,
                lymphNodes: String
            },
            pulmonaryExamination: {
                breathingStyle: String,
                lungSounds: String,
                chestExpansion: String,
                SpO2: Number
            },
            cardiovascularExamination: {
                heartRate: Number,
                heartRateCharacteristics: String,
                systolicBloodPressure: Number,
                diastolicBloodPressure: Number,
                meanBloodPressureIndex: Number,
                heartSounds: String,
                electrocardiogram: String,
                jugularVeinSigns: String,
                peripheralEdemaSigns: String
            },
            musculoskeletalExamination: {
                painLocation: String,
                painLevel: Number,
                rangeOfMotion: String,
                swelling: String,
                limbDeformity: String,
                muscleCondition: String,
                limbHemodynamics: String
            }
        },
        paraclinicalExamination: {
            bloodTest: bloodTestSchema,
            urinalysis: urinalysisSchema
        },
        xRayAndUltrasound: [xRayAndUltrasoundSchema],
        medications: [medicationSchema]
    }
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;
