


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

		If Not(OldSubCategoryName = NewSubCategoryName)  Then 
			If NewSubCategoryName = "No SubCategory" then	%>
				<table border = "0" width = "700"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
					<tr>
						<td colspan = "2"   height = "20"  >
							<H3>&nbsp;&nbsp;General <%=CategoryName%><br></H3>
						</td>
					</tr>
					<tr>
						<td colspan = "2"   height = "2"  background = "images/Underline.jpg"><img src = "images/px.gif". height = "2"></td>
					</tr>
					<tr>
						<td colspan = "2"   height = "5"  ><img src = "images/px.gif". height = "2"></td>
					</tr>
				</table>
		<% Else %>
					<table border = "0" width = "700"    leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
					<tr>
						<td colspan = "2"   height = "20"  >
							<H3>&nbsp;&nbsp;<%=NewSubCategoryName%>&nbsp;<%=CategoryName%><br></H3>
						</td>
					</tr>
					<tr>
						<td colspan = "2"   height = "2"  background = "images/Underline.jpg"><img src = "images/px.gif". height = "2"></td>
					</tr>
					<tr>
						<td colspan = "2"   height = "5"  ><img src = "images/px.gif". height = "2"></td>
					</tr>
			</table>

	<%	End If 
	End If 

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
         <table border = "0" width = "700"     leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >

          <% oldID =ProdID
               ProdID = rs("ProdID")
				While ProdID=  oldID 
					rs.movenext
					ProdID = rs("ProdID")
					
				'response.write( ID)
				wend
		 
		 
		ProdPrice= FormatCurrency(rs("ProdPrice"),2)
		ShortDescription = rs("prodShortDescription") 
		Description = rs("prodDescription")
		
		str1 = Description
		str2 = vblf
		If InStr(str1,str2) > 0 Then
			Description= Replace(str1, str2 , "</br>")
		End If  

		str1 = Description
		str2 = vbtab
		If InStr(str1,str2) > 0 Then
			Description= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
		End If  

		str1 = ShortDescription
		str2 = vblf
		If InStr(str1,str2) > 0 Then
			ShortDescription= Replace(str1, str2 , "</br>")
		End If  

		str1 = ShortDescription
		str2 = vbtab
		If InStr(str1,str2) > 0 Then
			ShortDescription= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
		End If  


		If Len(ShortDescription) > 5 Then

		else
		    If Len(Description) > 280 then
				ShortDescription = Left(Description, 280) & "..."
			Else
				ShortDescription = Description
			End If 
		End If 
				%> 
		<tr>
			<td>
			
	
		<table bgcolor = "#F0E1CF"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" border = "0">
			<tr> 
			
			<td align="center" width = "125"  class = "body" valign = "top"> <br>      
				<!--#Include file="ProductsDetailImageInclude.asp"--><br> 
			</td>
		  <td class= "body"  valign = "top" align = "center" width = "500"><br>
				<!--#Include file="StoreProdInfoInclude.asp"--><br> 
			</td>
		</tr>
		</table>
		   <br>


		

 <% OldSubCategoryName = NewSubCategoryName
             rs.movenext  %>
           
		  </table>
          <%     
         Wend %>
        

  