const mongoose = require('mongoose');
const faker = require('faker');
const bcrypt = require('bcrypt');
const Login = require('./models/LoginModel');
const Doctor = require('./models/DoctorModel');
const Patient = require('./models/PatientModel');
const Hospital = require('./models/HospitalModel');
const MedicalRecord = require('./models/MedicalRecordModel');
const Brand = require('./models/BrandModel');
const { mongoURI } = require('./config');

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('Connected to MongoDB');

        // Clear existing data
        await Login.deleteMany({});
        await Doctor.deleteMany({});
        await Patient.deleteMany({});
        await Hospital.deleteMany({});
        await MedicalRecord.deleteMany({});
        await Brand.deleteMany({});

        // Seed data
        const numberOfDoctors = 10;
        const numberOfPatients = 10;
        const numberOfHospitals = 5;
        const numberOfBrands = 5;

        const doctors = [];
        const patients = [];
        const hospitals = [];
        const brands = [];

        // Generate and insert hospitals
        for (let i = 0; i < numberOfHospitals; i++) {
            const password = faker.internet.password(10);
            const hashedPassword = await bcrypt.hash(password, 10);

            const hospital = new Hospital({
                name: faker.company.companyName(),
                username: faker.internet.userName() // Ensure unique usernames for hospitals
            });

            await hospital.save();
            hospitals.push(hospital);

            const login = new Login({
                username: hospital.username, // Use hospital's username
                password: hashedPassword,
                role: '0' // Hospital
            });

            await login.save();

            console.log(`Bệnh viện ${hospital.username} có mật khẩu gốc là: ${password}`);
        }

        // Generate and insert brands
        for (let i = 0; i < numberOfBrands; i++) {
            const randomHospital = faker.helpers.randomize(hospitals);
            const brand = new Brand({
                name: faker.company.companyName(),
                address: faker.address.streetAddress(),
                hospitalId: randomHospital._id
            });

            await brand.save();
            brands.push(brand);
        }

        // Generate and insert doctors
        for (let i = 0; i < numberOfDoctors; i++) {

            const randomBrand = faker.helpers.randomize(brands);

            const password = faker.internet.password(10);
            const hashedPassword = await bcrypt.hash(password, 10);

            const doctor = new Doctor({
                name: faker.name.findName(),
                identificationNumber: faker.datatype.uuid(),
                birthday: faker.date.past(30),
                phone: faker.phone.phoneNumber(),
                email: faker.internet.email(),
                sex: faker.name.gender(),
                address: faker.address.streetAddress(),
                brandId: randomBrand._id
            });

            await doctor.save();
            doctors.push(doctor);

            const login = new Login({
                username: doctor.identificationNumber,
                password: hashedPassword,
                role: '1' // Doctor
            });

            await login.save();

            console.log(`Bác sĩ ${doctor.identificationNumber} có mật khẩu gốc là: ${password}`);
        }

        // Generate and insert patients
        for (let i = 0; i < numberOfPatients; i++) {
            const password = faker.internet.password(10);
            const hashedPassword = await bcrypt.hash(password, 10);

            const patient = new Patient({
                name: faker.name.findName(),
                identificationNumber: faker.datatype.uuid(),
                birthday: faker.date.past(30),
                phone: faker.phone.phoneNumber(),
                email: faker.internet.email(),
                sex: faker.name.gender(),
                insuranceNumber: faker.datatype.uuid(),
                address: faker.address.streetAddress()
            });

            await patient.save();
            patients.push(patient);

            const login = new Login({
                username: patient.identificationNumber,
                password: hashedPassword,
                role: '2' // Patient
            });

            await login.save();

            console.log(`Bệnh nhân ${patient.identificationNumber} có mật khẩu gốc là: ${password}`);
        }

        // Generate and insert medical records
        for (let patient of patients) {
            const numberOfRecords = faker.datatype.number({ min: 2, max: 5 });
            for (let i = 0; i < numberOfRecords; i++) {
                const doctor = faker.helpers.randomize(doctors);
                const hospital = faker.helpers.randomize(hospitals);

                const medicalRecord = new MedicalRecord({
                    hospitalId: hospital._id,
                    patientId: patient._id,
                    doctorId: doctor._id,
                    results: {
                        generalExamination: {
                            temperature: faker.datatype.float({ min: 35, max: 39 }),
                            heartRate: faker.datatype.number({ min: 60, max: 100 }),
                            bloodPressure: {
                                systolic: faker.datatype.number({ min: 90, max: 180 }),
                                diastolic: faker.datatype.number({ min: 60, max: 120 })
                            },
                            breathingRate: faker.datatype.number({ min: 12, max: 20 }),
                            weight: faker.datatype.float({ min: 40, max: 120 }),
                            height: faker.datatype.float({ min: 150, max: 200 })
                        },
                        detailedOrganExamination: {
                            headAndNeck: {
                                eyes: faker.lorem.word(),
                                ears: faker.lorem.word(),
                                nose: faker.lorem.word(),
                                throat: faker.lorem.word(),
                                thyroid: faker.lorem.word(),
                                lymphNodes: faker.lorem.word()
                            },
                            pulmonaryExamination: {
                                breathingStyle: faker.lorem.word(),
                                lungSounds: faker.lorem.word(),
                                chestExpansion: faker.lorem.word(),
                                SpO2: faker.datatype.number({ min: 90, max: 100 })
                            },
                            cardiovascularExamination: {
                                heartRate: faker.datatype.number({ min: 60, max: 100 }),
                                heartRateCharacteristics: faker.lorem.word(),
                                systolicBloodPressure: faker.datatype.number({ min: 90, max: 180 }),
                                diastolicBloodPressure: faker.datatype.number({ min: 60, max: 120 }),
                                meanBloodPressureIndex: faker.datatype.float({ min: 70, max: 110 }),
                                heartSounds: faker.lorem.word(),
                                electrocardiogram: faker.lorem.word(),
                                jugularVeinSigns: faker.lorem.word(),
                                peripheralEdemaSigns: faker.lorem.word()
                            },
                            musculoskeletalExamination: {
                                painLocation: faker.lorem.word(),
                                painLevel: faker.datatype.number({ min: 0, max: 10 }),
                                rangeOfMotion: faker.lorem.word(),
                                swelling: faker.lorem.word(),
                                limbDeformity: faker.lorem.word(),
                                muscleCondition: faker.lorem.word(),
                                limbHemodynamics: faker.lorem.word()
                            }
                        },
                        paraclinicalExamination: {
                            bloodTest: {
                                completeBloodCount: {
                                    redBloodCells: faker.datatype.number(),
                                    hemoglobin: faker.datatype.number(),
                                    hematocrit: faker.datatype.number(),
                                    whiteBloodCellCount: faker.datatype.number(),
                                    plateletCount: faker.datatype.number(),
                                    meanRedBloodCellIndex: faker.datatype.number(),
                                    meanHemoglobinIndex: faker.datatype.number(),
                                    meanHemoglobinConcentrationIndex: faker.datatype.number(),
                                    redBloodCellDistributionWidth: faker.datatype.number()
                                },
                                bloodBiochemistry: {
                                    glucose: faker.datatype.number(),
                                    cholesterol: faker.datatype.number(),
                                    lowDensityLipoprotein: faker.datatype.number(),
                                    highDensityLipoprotein: faker.datatype.number(),
                                    triglycerides: faker.datatype.number(),
                                    alanineAminotransferase: faker.datatype.number(),
                                    aspartateAminotransferase: faker.datatype.number(),
                                    bilirubin: faker.datatype.number(),
                                    albumin: faker.datatype.number(),
                                    totalProtein: faker.datatype.number(),
                                    creatinine: faker.datatype.number(),
                                    bloodUreaNitrogen: faker.datatype.number(),
                                    sodium: faker.datatype.number(),
                                    potassium: faker.datatype.number(),
                                    chloride: faker.datatype.number(),
                                    bicarbonate: faker.datatype.number(),
                                    calcium: faker.datatype.number(),
                                    phosphorus: faker.datatype.number(),
                                    magnesium: faker.datatype.number(),
                                    thyroidStimulatingHormone: faker.datatype.number(),
                                    T3: faker.datatype.number(),
                                    T4: faker.datatype.number(),
                                    uricAcid: faker.datatype.number(),
                                    lactateDehydrogenase: faker.datatype.number(),
                                    cReactiveProtein: faker.datatype.number()
                                },
                                coagulationTest: {
                                    prothrombinTime: faker.datatype.number(),
                                    partialThromboplastinTime: faker.datatype.number(),
                                    internationalNormalizedRatio: faker.datatype.number(),
                                    fibrinogen: faker.datatype.number(),
                                    dDimer: faker.datatype.number(),
                                    plateletCount: faker.datatype.number(),
                                    enhancedThrombinTime: faker.datatype.number()
                                },
                                immunologicalTest: {
                                    antigen: faker.lorem.word(),
                                    cReactiveProtein: faker.datatype.number(),
                                    sedimentationRate: faker.datatype.number(),
                                    HLAtyping: faker.lorem.word(),
                                    antinuclearAntibody: faker.lorem.word(),
                                    rheumatoidFactor: faker.lorem.word(),
                                    antiDNAAntibodies: faker.lorem.word(),
                                    antiSmithAntibodies: faker.lorem.word(),
                                    complementLevels: {
                                        C3: faker.datatype.number(),
                                        C4: faker.datatype.number()
                                    },
                                    immunoglobulinLevels: {
                                        IgG: faker.datatype.number(),
                                        IgM: faker.datatype.number(),
                                        IgE: faker.datatype.number(),
                                        IgA: faker.datatype.number()
                                    },
                                    bLymphocyteCount: faker.datatype.number(),
                                    cytokines: faker.lorem.word(),
                                    TlymphocyteSubsets: {
                                        CD4PlusTCells: faker.datatype.number(),
                                        CD8PlusTCells: faker.datatype.number()
                                    }
                                },
                                hormoneTest: {
                                    thyroidStimulatingHormone: faker.datatype.number(),
                                    triiodothyronine: faker.datatype.number(),
                                    thyroxine: faker.datatype.number(),
                                    freeT3: faker.datatype.number(),
                                    freeT4: faker.datatype.number(),
                                    thyroidAntibodies: faker.lorem.word(),
                                    testosterone: faker.datatype.number(),
                                    progesterone: faker.datatype.number(),
                                    estrogen: faker.datatype.number(),
                                    luteinizingHormone: faker.datatype.number(),
                                    follicleStimulatingHormone: faker.datatype.number(),
                                    cortisol: faker.datatype.number(),
                                    adrenaline: faker.datatype.number(),
                                    norepinephrine: faker.datatype.number(),
                                    insulin: faker.datatype.number(),
                                    growthHormone: faker.datatype.number(),
                                    prolactin: faker.datatype.number(),
                                    vitaminD: faker.datatype.number()
                                }
                            },
                            urinalysis: {
                                color: faker.lorem.word(),
                                clarity: faker.lorem.word(),
                                pH: faker.datatype.number({ min: 4, max: 9 }),
                                specificGravity: faker.datatype.number({ min: 1, max: 2 }),
                                glucose: faker.datatype.number(),
                                bilirubin: faker.datatype.number(),
                                protein: faker.datatype.number(),
                                urobilinogen: faker.datatype.number(),
                                hemoglobin: faker.datatype.number(),
                                ketone: faker.datatype.number(),
                                nitrite: faker.datatype.number(),
                                leukocyteEsterase: faker.datatype.number(),
                                crystals: faker.lorem.word(),
                                mucus: faker.lorem.word(),
                                cells: {
                                    erythrocytes: faker.datatype.number(),
                                    leukocytes: faker.datatype.number(),
                                    epithelialCells: faker.datatype.number()
                                }
                            }
                        },
                        xRayAndUltrasound: [
                            {
                                image: faker.image.imageUrl(),
                                diagnosis: faker.lorem.sentence(),
                                name: faker.lorem.word(),
                                description: faker.lorem.sentence()
                            }
                        ],
                        medications: [
                            {
                                name: faker.lorem.word(),
                                instructions: faker.lorem.sentence(),
                                unitOfMeasure: faker.lorem.word(),
                                quantity: faker.datatype.number()
                            }
                        ]
                    }
                });

                await medicalRecord.save();
            }
        }

        console.log('Data seeded successfully');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
