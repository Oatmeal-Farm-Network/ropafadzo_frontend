
<table>

<%While Not rs.eof 
			counter = counter +1	%>          
         <tr>
          <%
             for x=1 to 3
	
				  if rs.eof then
					exit for
                 end if 
                alpacaID = rs("Animals.ID")
               'response.write( alpacaID)
               	alpacasPrice= rs("Price")

				


	sql = "SELECT * from MaleData WHERE ID=" & alpacaID
	'response.write (sql)
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql, conn, 3, 3   

	If rs3.eof Then
		DetailType = "Dam"
	Else
		DetailType = "Sire"
		StudFee = rs3("studfee")
		ReducedStudFee =rs3("ReducedStudFee")
	End if

	rs3.close

Animalcategory = (rs("Category"))
				'response.write (Criacategory)
				DetailType = "Other"
				If Animalcategory = "Dam" Or Animalcategory = "Maiden"Then
					DetailType = "Dam"
				End If
				If Animalcategory = "Herdsire" Or Animalcategory = "Jr. Herdsire" Then
					DetailType = "Sire"
				End if
				If Animalcategory = "Pet/ Fiber Quality"  Then
					DetailType = "Other"
				End if


		 photoID = "nophoto"
  
        imagelength = len(rs("ListPageImage"))
		if  imagelength > 5 then
            photoID = rs("ListPageImage")
		end if

               	If photoID = "nophoto" then 
			     click =  " <form action=""Details.asp"" method=""get"">" &_
                             "<input name=ID type=hidden value=" &  alpacaID & ">" & hiddenInput &_
							  "<input name=DetailType type=hidden value=" & DetailType & ">" &_
                            "<input name=Detail type=image src=""/uploads/ListPage/NotAvailableL.jpg""  border=0  width=""111"" >"
			Else
   			     click =  " <form action=""Details.asp"" method=""get"">" &_
                             "<input name=ID type=hidden value=" &  alpacaID & ">" & hiddenInput &_
							  "<input name=DetailType type=hidden value=" & DetailType & ">" &_
                            "<input name=Detail type=image src=""/uploads/ListPage/" & PhotoID &"""  border=0  width=""111"" >"     
                End If

				%> 
				
			<% Category = rs("Category")%>

			<td align="left" width = "120" valign = "top" class = "body" >                          
				 <table border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 style="border-style: ridge; border-color: #6a7d67 ; border-right-width: 3; border-left-width: 2; border-top-width: 2; border-bottom-width: 3" >
					<tr>
						<td><%=click%></td>
					</tr>
					</table></form><br>
            </td>
			<td class= "body"  valign = "top" >
					<a href = "Details.asp?ID=<%=alpacaID%>&DetailType=<%=DetailType%>&Detail.x=53&Detail.y=21" class = "body"><%=Trim(rs("FullName"))%></a><br>
					<small>
					<% If Len(rs("price")) > 2 Then %>
						Price: <%=(rs("price"))%><br>
					<%End if%>
					<% If Len(rs("Saleprice")) > 2 Then %>
						<font color = "#c8ba62">Sale Price:<b><%=(rs("Saleprice"))%></b></font><br>
					<%End if%>
					<% If Len(StudFee) > 2 Then %>
						Stud Fee:<b><%=(StudFee)%></b><br>
					<%End if%>
					<% If Len(ReducedStudFee) > 2 Then %>
						<font color = "#c8ba62">Reduced Stud Fee:<b><%=(ReducedStudFee)%></b></font><br>
					<%End if%>
					<%=rs("Color")%><br>
					<%=rs("Category")%><br>
					<a href = "Details.asp?ID=<%=alpacaID%>&DetailType=<%=DetailType%>&Detail.x=53&Detail.y=21" class = "body">To Learn More...</a></small>
			</td>
             <% rs.movenext
             next %>
           </tr>
          <%     
         Wend %>
        
       </form>
       </table>