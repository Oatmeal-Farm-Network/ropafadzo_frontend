
<% bcounter = 0
         pictureside = "left"

	
	CPCounter = 0
	 While CPCounter < CategoryCount
			CPCounter  = CPCounter  +1
	
				'CategoryProdIDArray(CPCounter)
				'SubCategoryIDArray(CPCounter) 



			sql = "SELECT  * FROM SFProducts WHERE  SFProducts.prodId = '" & CategoryProdIDArray(CPCounter) & "' order by SFProducts.prodSubCategoryId, ProdPrice DESC " 
			'response.write(sql)
     
			Set rs = Server.CreateObject("ADODB.Recordset")
			rs.Open sql, conn, 3, 3  
				NewSubcategoryID = rs("ProdSubcategoryID")
				NewSubcategoryName = "No SubCategory"

				If NewSubcategoryID > 1 then
					rs.close
					sql = "SELECT  * FROM SFProducts, sfsubcategories WHERE SFProducts.ProdSubCategoryID = sfsubcategories.subcatCategoryId and  SFProducts.prodId = '" & CategoryProdIDArray(CPCounter) & "' order by SFProducts.ProdSubCategoryID, ProdPrice DESC " 
					'response.write(sql)
					Set rs = Server.CreateObject("ADODB.Recordset")
					rs.Open sql, conn, 3, 3   

					NewSubcategoryID = rs("subcatCategoryId")
					NewSubcategoryName =  rs("SubcategoryName")

					'response.write("NewSubcategoryName=") 
					'response.write(NewSubcategoryName) 

				End if
					
					'response.write("OldSubcategoryName=") 
					'response.write(OldSubcategoryName) 

	

	   ProdDescription = rs("ProdDescription")
	    ProdSize = rs("ProdSize")
		ProdSellStore = rs("ProdSellStore")
		
		str1 = ProdDescription
		str2 = vblfvblf
		If InStr(str1,str2) > 0 Then
			ProdDescription= Replace(str1, str2 , "</br>")
		End If  


		str1 = ProdDescription
		str2 = vblf
		If InStr(str1,str2) > 0 Then
			ProdDescription= Replace(str1, str2 , "</br>")
		End If  

		str1 = ProdDescription
		str2 = vbtab
		If InStr(str1,str2) > 0 Then
			ProdDescription= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
		End If  


			counter = counter +1	
			If pictureside = "left" then
			    pictureside = "right"
		 Else
		     pictureside = "left" 
	    End if
		 %>          


          <% oldID = ID
                ID = rs("ProdID")
				while ID=  oldID 
					rs.movenext
					ID = rs("ID")
				
				'response.write( ID)
				wend
		 
		 
		ProdPrice= FormatCurrency(rs("ProdPrice"),2)


				%> 

			
	
		<table bgcolor = "#F0E1CF"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" border = "0" width = "500"> 
			<tr> 
			
			<td align="center" width = "100"  class = "body" valign = "top"> <br>      
				<!--#Include file="regProductsDetailImageInclude.asp"--><br> 
			</td>
		  <td class= "body"  valign = "top" align = "center" width = "400"><br>
				<!--#Include file="regStoreProdInfoInclude.asp"--><br> 
			</td>
		</tr>
		</table>



		

 <% OldSubCategoryName = NewSubCategoryName
             rs.movenext  %>
           
	
          <%     
         Wend %>
        

  