//add food

// INSERT INTO `foods` (`id`, `fd_name`, `fd_category`, `fd_full_price`, `fd_three_bi_two_prs`, `fd_half_price`, `fd_qtr_price`, `fd_is_loos`, `fd_shop_id`, `fd_img`, `fd_is_today`)
//  VALUES (NULL, 'chicken curry', 'lunch', '300', '0', '0', '0', 'no', '5', 'no_data', 'yes');





 ///update food
router.post('/updateFood', (req, res) => {


    try {

      const form = new formidable.IncomingForm();
      const uploadFolder = 'uploads'
      form.multiples = false;
      form.maxFileSize = 50 * 1024 * 1024; // 5MB
      form.uploadDir = uploadFolder;
      //console.log(form);
      // Parsing
    form.parse(req, async (err, fields, files) => {
    
      console.log(fields)
      console.log(files)
      
      if (err) {
        console.log("Error parsing the files");
        return res.json({"error": true,"error_code":err,"total_size": 0, data: null })
       
      }
     
     
      //check file is exist or not
      var imgLength = Object.keys(files).length
      const fileCheck = files.myFile;
      if (imgLength == 0 || !fileCheck) {
        console.log(uploadFolder)
        
        /// no file
        try {
          insert_body = {
             "fd_name": fields.fd_name,
             "fd_category": fields.fd_category,
             "fd_full_price": fields.fd_full_price,
             "fd_three_bi_two_prs": fields.fd_three_bi_two_prs,
             "fd_half_price": fields.fd_half_price,
             "fd_qtr_price": fields.fd_qtr_price,
             "fd_is_loos": fields.fd_is_loos,
             "cook_time": fields.cook_time,
             "fd_shop_id": fields.fd_shop_id,
             "fd_img": "no_data",
             "fd_is_today": "no"
            }
    
            con.query(
              "UPDATE foods SET fd_name = ? ,fd_category = ? ,fd_full_price = ?,fd_three_bi_two_prs = ?,fd_half_price = ?,fd_qtr_price = ?,fd_is_loos = ?,cook_time,fd_shop_id = ?,fd_img = ?,cook_time = ? = ? WHERE id = ?",
              [requst.fd_is_today, id],
              (err, results) => {
                if (err) {
                  console.log("error: ", err);
                  res.json({"error": true,"error_code":err['code'],"total_size": 0,"data":null})
                  return;
                }
                if (results.affectedRows == 0) {
                  // not found Tutorial with the id
                  res.json({"error": true,"error_code":"Item Not fount","total_size": 0,"data":null})
                  return;
                }
                console.log("created tutorial: ", { id: id, ...requst });
                res.json({"error": false,"error_code":"Updated successfully","total_size": 0,"data":null})
      
              }
            );
            
          } catch (e) {
           res.json({"error": true,"error_code":e,"total_size": 0, data: null })
          }
    
         
      } 
      else if(imgLength>1){

        return res.json({"error": true,"error_code":'multiple file cant upload',"total_size": 0, data: null })
        
      }
      else {
          const isFileValid = (file) => {
          const type = file.originalFilename.split('.').pop();
          const validTypes = ["jpg", "jpeg", "png"];
          if (validTypes.indexOf(type) === -1) {
            return false;
          }
          return true;
        };
      
      // Check if multiple files or a single file
      if (!files.myFile.length) {
        //Single file
      
        const file = files.myFile;
    
        
        // checks if the file is valid
        const isValid = isFileValid(file);
      
        // creates a valid name by removing spaces
        const fileName = encodeURIComponent(file.newFilename+'.'+file.originalFilename.split(".").pop());
      
        if (!isValid) {
          // throes error if file isn't valid
          return  res.json({"error": true,"error_code":'The file type is not a valid type',"total_size": 0, data: null })
          
          
        }
        try {
          // renames the file in the directory
          fs.renameSync(file.filepath, path.join(uploadFolder, fileName))
    
          try {
            insert_body = {
              "fd_name": fields.fd_name,
              "fd_category": fields.fd_category,
              "fd_full_price": fields.fd_full_price,
              "fd_three_bi_two_prs": fields.fd_three_bi_two_prs,
              "fd_half_price": fields.fd_half_price,
              "fd_qtr_price": fields.fd_qtr_price,
              "fd_is_loos": fields.fd_is_loos,
              "cook_time": fields.cook_time,
              "fd_shop_id": fields.fd_shop_id,
              "fd_img": "https://mobizate.com/uploads/"+fileName,
              "fd_is_today": "no"
              
             }
             con.query("INSERT INTO foods SET ?", insert_body, (err, results, fields) => { 
               if (err) {        
                 console.log(err)   
                 //res.send('Sql NOT updated & File NOT uploaded ')
                 res.json({"error": true,"error_code":err['code'],"total_size": 0, data: null })
               } else {
                res.json({"error": false,"error_code":'data added success',"total_size": 0, data: null })               
               }
             });
              
            } catch (e) {
             res.json({"error": true,"error_code":e,"total_size": 0, data: null })
            }
    
            
        } catch (error) {
          console.log(error);
          return  res.json({"error": true,"error_code":error,"total_size": 0, data: null })
         
        }
    
      } else {
        // Multiple files
        return  res.json({"error": true,"error_code":'multiple file cant upload',"total_size": 0, data: null })
       
      }
      }
    
    
    
    });
    
      
    } catch (error) {
      return res.json({"error": true,"error_code":error,"total_size": 0, data: null })
      
    }



  
  });