const User = require("../model/user.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const messagebird = require('messagebird')(process.env.MESSAGEBIRD_API_KEY); // changer la key
const keyToken = 'P7H}9C7ccv^Sk7Yia0C1Te1o3g2gqTt6EmuyIi.g8(}iQLM+sGX5577&0SF)e50)kjDomBt6Ns^MAHZ7#3Tq{87~2m=UInz7L05@XwC2dJHS5FAX:P?3@:2ALII4G@Hf!Uc1akX?:xMm6bt<(b27VW80lcVf&;d99CVfNS+0Ni28Q{q8!7Y5}(C48zO@x5C8-PHn/j=Bc00998C{VK:cE09GS5_B10R8YR3?077r~v89hQI6p{Kydu65|0$py&c{Pdl[70FL|B%);uib4dQ5@6!^%6^$j1vhn2%5H=E02!6224[nFiF5,&ctI-~s(7@L&:,~0e281ki>1A7FS7:7$2KTfe3u787a^8-qH4Yu6R96a@)p25811~|RG,9UpsA$;1hW7[(/OZb5)6rN~:swMTam7/h!{^PjWE0<2WK$+$i?}p:%e;3g~A%:q)zZs$lL9$A>Z>qF}[4wUYf#0&Mq8csI$?5F2mG@o^ZhsMa]wRDSqY#m0[j@lt/$zoW7';


exports.creatUser = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
                tel: req.body.tel,
                compt: 0,
                ip: "ip"
            });
            user.save()
                .then(user => {
                    res.status(201).json({
                        idUser: user._id,
                        token: jwt.sign(
                            {idUser: user._id, mail: user.email},
                            keyToken,
                            {expiresIn: '20h'}
                        )
                    });
                })
                .catch(error => res.status(403).json({
                    error: "Mail already use"
                }));
        })
        .catch(error => {
            res.status(500).json({error: error.message})
        });
}

exports.connexionUser = (req, res, next) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
            if (user) {
                if (user.compt === 5) {
                    res.status(500).json({error: "Compte bloqué, contactez l'admin"})
                } else {
                    bcrypt.compare(req.body.password, user.password).then(boolean => {
                            if (boolean) {
                                if (user.ip === "ip") {
                                    user.updateOne({
                                        ip: req.ip
                                    }).then(() => res.status(200))
                                        .catch((err) => res.status(500).json({error: 'Peut pas changer ip', err: err.message}))
                                    user.ip = req.ip
                                } else if (user.ip !== req.ip) {
                                    res.status(500).json({error: 'Connectez vous avec votre ordinateur habituel. Veuillez contacter l\'admin pour tout changement de poste'})
                                }
                                user.updateOne({
                                    compt: 0
                                }).then(() => res.status(200))
                                    .catch((err) => res.status(500).json({error: 'Peut pas changer compte', err: err.message}))
                                let number = user.tel;
                                messagebird.verify.create(number, {
                                    originator: 'Code',
                                    template: 'Your verification code is %token.'
                                }, function (err, response) {
                                    if (err) {
                                        res.status(500).json({error: err.message})
                                    } else {
                                        res.status(200).json({
                                            idUser: user._id,
                                            tokenCode: jwt.sign(
                                                {code_sms: response.id},
                                                keyToken,
                                                {expiresIn: '20h'},
                                            )
                                        });
                                    }
                                })

                            } else {
                                user.updateOne({
                                    compt: user.compt + 1
                                }).then(() => res.status(500).json({error: 'Mauvais mot de passe ou email'}))
                                    .catch((err) => res.status(500).json({error: 'Peut pas changer compte', err: err.message}))
                            }
                        }
                    )
                }
            } else {
                res.status(500).json({error: 'Mauvais mot de passe ou email'})
            }

        }
    )
}

exports.verifCodeSms = (req, res, next) => {
    let tokenCode = req.headers.authorization;
    let decodedTokenCode = jwt.verify(tokenCode, keyToken);
    let finalTokenCode = decodedTokenCode.code_sms;

    let code = req.body.code;
    messagebird.verify.verify(finalTokenCode, code, function (err, response) {
        if (err) {
            res.status(500).json({error: 'TEST'})
        } else {
            res.status(200).json({
                token: jwt.sign(
                    {mail: req.body.email},
                    keyToken,
                    {expiresIn: '20h'}
                )
            });
        }
    });
}