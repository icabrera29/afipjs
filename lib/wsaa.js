'use strict';

const { TRA } = require('./tickets/tra');
const { TA } = require('./tickets/ta');
const { Certificate } = require('@fidm/x509');
const fs = require('fs');

const _default = {
    config : {
        crt: "crt_homo.crt",
        key: "key_homo.key",
        prod:false,
        url_wdsl_devel:"https://wsaahomo.afip.gov.ar/ws/services/LoginCms?WSDL",
        url_wdsl_prod:"https://wsaahomo.afip.gov.ar/ws/services/LoginCms?WSDL",
        tmpTAFileDir:"./",
        service:"wsfe",
        debug:false,
        url_wdsl:this.url_wdsl_devel,
        mock:false
    }
};

class Wsaa {

    constructor(config){
        this.config = {
            ..._default.config, 
            ...config,
        };
        this.config.url_wdsl = 
            (this.config.prod)?
                this.config.url_wdsl_prod :
                this.config.url_wdsl_devel;

        let cert = Certificate.fromPEM(fs.readFileSync( this.config.crt ))
        this.certifcate = {
            validFrom: cert.validFrom,
            validTo: cert.validTo,
            version: cert.version,
            serialNumber: cert.serialNumber,
            issuer: { 
                CN: cert.issuer.commonName,
                C: cert.issuer.countryName,
                O: cert.issuer.organizationName, 
            },
            subject: { 
                CN: cert.subject.commonName,
                SN: cert.subject.serialName,
            }
        }
    }

    /**
     * Crear un TRA (Ticket de Requerimiento de Acceso)
     * @returns Retorna un objeto de tipo TRA
     */

    createTRA(){
        return new TRA(this.config);  
    }

    /**
     * Se create un TA almacenado en el filesystem 
     * @returns Retorna un objeto de tipo TA
     */
    
    createTAFromFile(config){
        
        this.config = {
            ..._default.config, 
            ...config,
        };

        try {
            const filename = `${this.config.tmpTAFileDir}/TA-${this.config.service}.xml`;
            const content = fs.readFileSync(filename, 'utf8');
            return new TA(content, this.config);
        }catch(err){
            throw(err);
        }
    }

}

module.exports= {
    Wsaa
};